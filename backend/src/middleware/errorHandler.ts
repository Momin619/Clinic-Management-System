// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError.js";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: "error",
      code: err.code,
      message: err.message,
      fieldErrors: err.fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: "error",
      code: err.code,
      message: err.message,
    });
  }

  // unknown/unexpected errors
  console.error("Unhandled error:", err);
  return res.status(500).json({
    status: "error",
    code: "INTERNAL_ERROR",
    message: "fdfdf",
  });
};
