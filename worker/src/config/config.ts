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

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("AWS key not found");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS secret key not found");
}

const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_PORT: Number(process.env.REDIS_PORT),
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

export default config;
