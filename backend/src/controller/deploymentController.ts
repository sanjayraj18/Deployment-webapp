import { Request, Response } from "express";
import { deploymentService } from "../service/deploymentService.js";

export const deploymentController = async (req: Request, res: Response) => {
  const { github_url, userId } = req.body;

  const result = await deploymentService(github_url, userId);

  return res.status(201).json(result);
};
