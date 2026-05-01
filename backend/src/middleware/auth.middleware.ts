import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { TokenPayload, AuthRequest } from "../modules/auth/auth.types.js";
import { NextFunction, Response } from "express";
export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken; // 👈 from cookie

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;

    req.user = decoded; // attach user payload
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
