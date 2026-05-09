import type { CookieOptions } from "express";

// 1 hour = 60 * 60 * 1000 ms
export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 1000, // 1 hour
};

// 7 days = 7 * 24 * 60 * 60 * 1000 ms
export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
