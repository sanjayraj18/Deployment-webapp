import { spawn } from "node:child_process";
import path from "node:path";
import simpleGit from "simple-git";
import redisClient from "./config/redis.js";
import prisma from "./db/db.js";
import uploadManager from "./aws-upload/uploadManager.js";

const git = simpleGit();

async function startWorker() {
  try {
    await redisClient.connect();
    console.log("Worker connected to Redis and waiting for jobs...");

    while (true) {
      const result: any = await redisClient.brPop("deployments", 0);
      const job = JSON.parse(result?.element);
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

        // 2. Building (Using Spawn for Live logs)
        const child = spawn("sh", ["-c", `cd ${outputDir} && npm install && npm run build`]);

        child.stdout.on("data", (data) => {
          const log = data.toString();
          console.log(log);
          redisClient.publish(`logs:${job.id}`, log);
        });

        child.stderr.on("data", (data) => {
          const log = data.toString();
          console.error(log);
          redisClient.publish(`logs:${job.id}`, log);
        });

        const exitCode = await new Promise((resolve) => {
          child.on("close", resolve);
        });

        if (exitCode !== 0) {
          throw new Error(`Build failed with code ${exitCode}`);
        }

        // 3. Upload to S3
        const distPath = path.join(outputDir, "dist");
        await uploadManager(distPath, job.id);

        // 4. Finalize Success
        await prisma.deployment.update({
          where: { id: job.id },
          data: { status: "ready" },
        });

        console.log(`[Worker] Job ${job.id} completed.`);

      } catch (error) {
        console.error(`[Worker] Job ${job.id} failed:`, error);
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
