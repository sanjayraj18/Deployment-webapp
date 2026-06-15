import { Request, Response } from "express";

export const deploymentController = async (req: Request, res: Response) => {
  const { github_url, userId } = req.body;
};
