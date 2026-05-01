import dotenv from "dotenv";

dotenv.config();

// helper to safely read env variables
const getEnv = (key: string, required = true) => {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value as string;
};

// exported env variables
export const PORT = getEnv("PORT", false) || "5000";

export const MONGO_URI = getEnv("MONGO_URI");

export const ACCESS_TOKEN_SECRET = getEnv("ACCESS_TOKEN_SECRET");
export const REFRESH_TOKEN_SECRET = getEnv("REFRESH_TOKEN_SECRET");

export const ACCESS_TOKEN_EXPIRE =
  getEnv("ACCESS_TOKEN_EXPIRE", false) || "15m";
export const REFRESH_TOKEN_EXPIRE =
  getEnv("REFRESH_TOKEN_EXPIRE", false) || "7d";

export const CLIENT_URL =
  getEnv("CLIENT_URL", false) || "http://localhost:5173";

export const NODE_ENV = getEnv("NODE_ENV", false) || "development";
