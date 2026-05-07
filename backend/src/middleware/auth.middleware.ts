import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { TokenPayload } from "../modules/auth/auth.types.js";
import { NextFunction, Response, Request } from "express";
import { AppError } from "../errors/AppError.js";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new AppError(401, "NO_TOKEN", "Access token missing"));
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, "TOKEN_EXPIRED", "Access token expired"));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, "INVALID_TOKEN", "Invalid access token"));
    }
    return next(new AppError(500, "AUTH_ERROR", "Authentication failed"));
  }
};
