import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../../config/env.js";
import { NextFunction, Response, Request } from "express";
import { TokenPayload } from "../auth/auth.types.js";
import { sendError } from "../../utils/response-helper.js";

export const protectRefresh = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return sendError(res, 401, "NO_REFRESH_TOKEN", "Refresh token missing");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
    ) as TokenPayload;

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    return sendError(
      res,
      401,
      "INVALID_REFRESH_TOKEN",
      "Invalid or expired refresh token",
    );
  }
};
