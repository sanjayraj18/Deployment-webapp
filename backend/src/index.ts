import cookieParser from "cookie-parser";
import Express from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import config from "./config/config.js";
import redisClient from "./config/redis.js";
import deploymentRoutes from "./routes/deploymentRoutes.js";

const app = Express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(morgan("dev"));
app.use(cookieParser());
app.use(Express.json());

app.use("/api/v1", deploymentRoutes);

const subcriber = redisClient.duplicate();
await subcriber.connect();

io.on("connection", (socket) => {
  console.log("user connected to the socket", socket.id);

  socket.on("subcribe", async (deploymentId: string) => {
    const channel = `logs_:${deploymentId}`;

    socket.join(channel);

    await subcriber.subscribe(channel, (message) => {
      io.to(channel).emit("log", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

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
  httpServer.listen(config.PORT, () => console.log("server started"));
};

startServer();
