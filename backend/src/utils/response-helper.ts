import { Response } from "express";
import { ErrorCode, ApiOk, ApiResponse } from "../types/response.types.js";

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

// overload 1: no data
export function sendSuccess(
  res: Response,
  message: string,
  status?: number,
): Response;

// overload 2: with data — message now required not optional
export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string, // ← required
  status?: number,
): Response;

// implementation
// implementation
export function sendSuccess<T>(
  res: Response,
  dataOrMessage: T | string,
  messageOrStatus?: string | number,
  status = 200,
): Response {
  if (typeof dataOrMessage === "string") {
    const body: ApiOk = {
      success: true,
      message: dataOrMessage,
    };
    return res
      .status(typeof messageOrStatus === "number" ? messageOrStatus : 200)
      .json(body);
  }

  // message is now guaranteed to be a string here — no need for spread
  const body: ApiResponse<T> = {
    success: true,
    message: messageOrStatus as string, // ← always string in overload 2
    result: dataOrMessage,
  };
  return res.status(status).json(body);
}
