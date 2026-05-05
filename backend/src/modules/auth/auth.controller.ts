import { Request, Response, NextFunction } from "express";
import { signupService, loginService, refreshService } from "./auth.service.js";
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

    return sendSuccess<{ user: AdminPublic }>(
      res,
      { user: result.user },
      "Login successful",
    );
  } catch (err) {
    next(err);
  }
};

// ME — user object needed to restore session
export const me = async (req: Request, res: Response) => {
  const user = await Admin.findById(req.user!.id).select("name email");

  if (!user) {
    return sendError(res, 404, "NOT_FOUND", "Admin not found");
  }

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
