import { Request, Response, NextFunction } from "express";
import {
  signupService,
  loginService,
  refreshService,
  updateNameService,
  updatePasswordService,
} from "./auth.service.js";
import Admin from "./auth.model.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../config/cookieConfig.js";
import { sendSuccess, sendError } from "../../utils/response-helper.js";
import { AdminPublic } from "./auth.types.js";

// SIGNUP — no data needed, just confirm it worked
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    await signupService(name, email, password);
    return sendSuccess(res, "Account created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// LOGIN — user object needed by frontend
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, password } = req.body;
    const result = await loginService(identifier, password);

    res.cookie("accessToken", result.accessToken, accessCookieOptions);
    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);
    console.log(result.user);
    return sendSuccess<{ user: AdminPublic }>(
      res,
      { user: result.user },
      "Login successful",
    );
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response) => {
  const admin = await Admin.findById(req.user!.id).select("_id name email");

  if (!admin) {
    return sendError(res, 404, "NOT_FOUND", "Admin not found");
  }

  const adminId = admin._id.toString();

  // map _id → id to match AdminPublic type
  const user: AdminPublic = {
    id: adminId,
    name: admin.name,
    email: admin.email,
  };

  return sendSuccess<{ user: AdminPublic }>(res, { user }, "Admin fetched");
};
// REFRESH — only sets cookies, no data returned
export const refresh = (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tokens = refreshService(userId);

  res.cookie("accessToken", tokens.accessToken, accessCookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

  return sendSuccess(res, "Tokens refreshed");
};

// auth.controller.ts
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendSuccess(res, "Logged out successfully");
};

export const updateName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body; // already validated + stripped by Zod middleware
    const user = await updateNameService(req.user!.id, name);
    return sendSuccess<{ user: AdminPublic }>(
      res,
      { user },
      "Name updated successfully",
    );
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE PASSWORD ─────────────────────────────────────────────────────────

/**
 * PATCH /api/auth/me/password
 * Protected — requires valid access token.
 * Body: { currentPassword, newPassword, confirmPassword }
 *
 * confirmPassword equality is enforced at the schema level (Zod .refine),
 * so only currentPassword + newPassword are forwarded to the service.
 */
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await updatePasswordService(req.user!.id, currentPassword, newPassword);
    return sendSuccess(res, "Password updated successfully");
  } catch (err) {
    next(err);
  }
};
