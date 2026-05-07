// src/middleware/validate.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError.js";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return next(new ValidationError(fieldErrors));
    }

    req.body = result.data;
    next();
  };
