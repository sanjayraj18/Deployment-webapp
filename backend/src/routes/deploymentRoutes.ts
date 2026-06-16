import Router from "express";
import { deploymentController } from "../controller/deploymentController.js";

const deploymentRoutes = Router();

deploymentRoutes.post("/deploy", deploymentController);

export default deploymentRoutes;
