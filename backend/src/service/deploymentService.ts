import prisma from "../db/db";

export const deploymentService = async (github_url: String, userId: string) => {
  try {
    const deployment = await prisma.deployment.create({
      data: {
        github_url,
        userId,
        status: "pending",
      },
    });
  } catch (error) {
    console.warn("Deployment failed:", error);
    throw new Error("Failed to process deployment");
  }
};
