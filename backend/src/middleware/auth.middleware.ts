import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/env.js";
import { TokenPayload } from "../modules/auth/auth.types.js";
import { sendError } from "../utils/response-helper.js";
import { NextFunction, Response, Request } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;

    // ❌ no token
    if (!token) {
      return sendError(res, 401, "NO_TOKEN", "Access token missing");
    }

    // ✅ verify token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return sendError(res, 401, "TOKEN_EXPIRED", "Access token expired");
    }

    if (err instanceof jwt.JsonWebTokenError) {
      return sendError(res, 401, "INVALID_TOKEN", "Invalid access token");
    }

    return sendError(res, 500, "AUTH_ERROR", "Authentication failed");
  }
};
