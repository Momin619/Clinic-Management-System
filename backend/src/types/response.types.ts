export type ErrorCode =
  | "NO_TOKEN"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "NO_REFRESH_TOKEN"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "SERVER_ERROR"
  | "AUTH_ERROR"
  | "INVALID_REFRESH_TOKEN";

export interface ApiError {
  success: false;
  code: ErrorCode;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: true;
  message?: string;
  data: T;
}
