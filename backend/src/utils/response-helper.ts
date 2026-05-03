import { Response } from "express";
import { ErrorCode } from "../types/response.types.js";

export const sendError = (
  res: Response,
  status: number,
  code: ErrorCode,
  message: string,
) => {
  return res.status(status).json({
    success: false,
    code,
    message,
  });
};
