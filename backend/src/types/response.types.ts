export type ErrorCode =
  | "NO_TOKEN"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "NO_REFRESH_TOKEN"
  | "INVALID_REFRESH_TOKEN"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_EMAIL_TAKEN"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "SERVER_ERROR";

export interface ApiError {
  success: false;
  code: ErrorCode;
  message: string;
}

export interface ApiOk {
  success: true;
  message: string; // ✓ required
}

export interface ApiResponse<T> {
  success: true;
  message: string; // ✓ required now
  data: T;
}
