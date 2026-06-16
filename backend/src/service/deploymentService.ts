import prisma from "../db/db.js";
import redisClient from "../config/redis.js";

export const deploymentService = async (github_url: string, userId: string) => {
  try {
    const deployment = await prisma.deployment.create({
      data: {
        github_url,
        userId,
        status: "pending",
      },
    });

    await redisClient.lPush("deployments", JSON.stringify({
      id: deployment.id,
      url: deployment.github_url
    }));

    return deployment;
  } catch (error) {
    console.warn("Deployment failed:", error);
    throw new Error("Failed to process deployment");
  }
};
