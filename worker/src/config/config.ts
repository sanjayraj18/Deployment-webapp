import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("port number not found");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DB url not found");
}

if (!process.env.REDIS_PORT) {
  throw new Error("redis port not found");
}

if (!process.env.REDIS_HOST) {
  throw new Error("redis host not found");
}

if (!process.env.REDIS_PASSWORD) {
  throw new Error("redis password not found");
}

const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
};

export default config;
