import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("port number not found");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DB url not found");
}

const config = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;
