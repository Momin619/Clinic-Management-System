// src/errors/ValidationError.ts
import { AppError } from "./AppError.js";

export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  constructor(public readonly fieldErrors: FieldError[]) {
    super(400, "VALIDATION_ERROR", "Validation failed");
    this.name = "ValidationError";
  }
}
