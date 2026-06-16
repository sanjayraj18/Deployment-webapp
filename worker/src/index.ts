import { spawn } from "node:child_process";
import path from "node:path";
import simpleGit from "simple-git";
import redisClient from "./config/redis.js";
import prisma from "./db/db.js";

// const execPromise = promisify(exec);
// const { stdout } = await execPromise(buildCommand);
const git = simpleGit();

async function startWorker() {
  try {
    await redisClient.connect();
    console.log("Worker connected to Redis and waiting for jobs...");

    while (true) {
      const result: any = await redisClient.brPop("deployments", 0);
      const job = JSON.parse(result?.element);

      // In CommonJS, __dirname is globally available.
      const outputDir = path.resolve(__dirname, `../output/${job.id}`);

      try {
        console.log(`[Worker] Processing job ${job.id} for ${job.url}`);

        await prisma.deployment.update({
          where: { id: job.id },
          data: { status: "building" },
        });

        // 1. Cloning
        await git.clone(job.url, outputDir);
        console.log(`[Worker] Cloned successfully.`);

        // 2. Building
        const child = spawn("sh", [
          "-c",
          `cd ${outputDir} && npm install && npm run build`,
        ]);

        child.stdout.on("data", (data) => {
          const logLine = data.toString();
          console.log(logLine);

          redisClient.publish(`logs:${job.id}`, logLine);
        });

        child.stderr.on("data", (data) => {
          const logLine = data.toString();
          console.error(logLine);

          redisClient.publish(`logs:${job.id}`, logLine);
        });

        const exitCode = await new Promise((resolve) => {
          child.on("close", (code) => {
            resolve(code);
          });
        });

        if (exitCode !== 0) {
          throw new Error(`Build failed with exit code ${exitCode}`);
        }

        console.log(`[Worker] Build complete.`);

        // 3. Finalize Success
        await prisma.deployment.update({
          where: { id: job.id },
          data: { status: "ready" },
        });
      } catch (error) {
        console.error(`[Worker] Job ${job.id} failed:`, error);

        // 4. Finalize Failure
        await prisma.deployment.update({
          where: { id: job.id },
          data: { status: "failed" },
        });
      }
    }
  } catch (error) {
    console.error("Worker fatal error:", error);
  }
}

startWorker();
