import Router from "express";
import { deploymentController } from "../controller/deploymentController";

const deploymentRoutes = Router();

deploymentRoutes.post("/deploy", deploymentController);

export default deploymentRoutes;
