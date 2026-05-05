// src/errors/AppError.ts
import { ErrorCode } from "../types/response.types.js";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
