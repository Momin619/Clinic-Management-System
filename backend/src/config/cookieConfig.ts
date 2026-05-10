import type { CookieOptions } from "express";

// Access token — 15m JWT, 16m cookie
export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 16 * 60 * 1000, // 16 minutes
};

// Refresh token — 7d JWT, 7d + 5min cookie
export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: (7 * 24 * 60 * 60 + 5 * 60) * 1000, // 7 days + 5 minutes
};
