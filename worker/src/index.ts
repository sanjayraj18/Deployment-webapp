import Express from "express";
import redisClient from "./config/redis";

const app = Express();

async function startWorker() {
  try {
    await redisClient.connect();
    console.log("Worker connected to Redis and waiting for jobs...");

    while (true) {
      const result = await redisClient.brPop("deployments", 0);
      if (result) {
        const job = JSON.parse(result.element);
        console.log(`[Worker] Received job: ${job.id} for URL: ${job.url}`);
      }
    }
  } catch (error) {
    console.error("Error processing job:", error);
  }
}

startWorker();
