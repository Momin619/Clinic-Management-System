// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { sendError } from "../utils/response-helper.js";

// errorHandler.ts
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.locals.errorCode = err.code; // ← stash for logger
    res.locals.errorMessage = err.message;
    return sendError(res, err.status, err.code, err.message);
  }

  res.locals.errorCode = "SERVER_ERROR";
  res.locals.errorMessage = "Something went wrong";
  console.error("[Unhandled]", err);
  return sendError(res, 500, "SERVER_ERROR", "Something went wrong");
};
