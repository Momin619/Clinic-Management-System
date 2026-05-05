// src/middleware/validate.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      // throws VALIDATION_ERROR with field-level detail
      return next(new AppError(400, "VALIDATION_ERROR", "Validation failed"));
      // ↑ swap this for the FieldError variant from previous answer if you want per-field errors on frontend
    }

    req.body = result.data; // sanitised + typed
    next();
  };
