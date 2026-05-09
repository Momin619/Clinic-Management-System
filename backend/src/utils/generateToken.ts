import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/env.js";
export const createAccessToken = (id: string) => {
  return jwt.sign({ id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
};

export const createRefreshToken = (id: string) => {
  return jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};
