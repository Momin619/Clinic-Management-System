// src/types/response.types.ts
export type ErrorCode =
  // — auth / token —
  | "NO_TOKEN"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "NO_REFRESH_TOKEN"
  | "INVALID_REFRESH_TOKEN"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_EMAIL_TAKEN"
  | "SAME_NAME"
  | "NAME_TAKEN"
  // — validation —
  | "VALIDATION_ERROR"
  // — general —
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INTERNAL_ERROR" // ← was missing, used in errorHandler fallback
  | "SERVER_ERROR" // keep if used in protect.ts sendError calls
  | "AUTH_ERROR"; // ← was missing, used in protect.ts catch fallback // ← used in errorHandler.ts fallback;

export interface ApiError {
  success: false;
  code: ErrorCode;
  message: string;
  fieldErrors?: { field: string; message: string }[];
}

export interface ApiOk {
  success: true;
  message: string; // ✓ required
}

export interface ApiResponse<T> {
  success: true;
  message: string; // ✓ required now
  result: T;
}
