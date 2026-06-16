import cookieParser from "cookie-parser";
import Express from "express";
import morgan from "morgan";
import config from "./config/config.js";
import redisClient from "./config/redis.js";
import deploymentRoutes from "./routes/deploymentRoutes.js";

const app = Express();
app.use(morgan("dev"));
app.use(cookieParser());

app.use(Express.json());

app.use("/api/v1", deploymentRoutes);

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (e) {
    console.warn("Error in connecting redis", e);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectRedis();
  app.listen(config.PORT, () => console.log("server started"));
};

startServer();
