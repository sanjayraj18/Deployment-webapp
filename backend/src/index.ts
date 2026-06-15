import cookieParser from "cookie-parser";
import Express from "express";
import morgan from "morgan";
import config from "./config/config";
import deploymentRoutes from "./routes/deploymentRoutes";

const app = Express();
app.use(morgan("dev"));
app.use(cookieParser());

app.use(Express.json());

app.use("/api/v1", deploymentRoutes);

app.listen(config.PORT, () => console.log("server started"));
