import { Request, Response } from "express";
import { signupService, loginService, refreshService } from "./auth.service.js";

import Admin from "./auth.model.js";

import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../config/cookieConfig.js";

// SIGNUP
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await signupService(name, email, password);

    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    const result = await loginService(identifier, password);

    res.cookie("accessToken", result.accessToken, accessCookieOptions);

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

    res.json({
      user: result.user,
    });
  } catch (err: any) {
    console.log(err?.message);

    res.status(400).json({
      message: err.message,
    });
  }
};

export const me = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "No user in request" });
  }

  const user = await Admin.findById(userId).select("name email");

  res.json({ user });
};

// REFRESH TOKEN
export const refresh = (req: Request, res: Response) => {
  const userId = req.user!.id; // from middleware

  const tokens = refreshService(userId);

  res.cookie("accessToken", tokens.accessToken, accessCookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, refreshCookieOptions);

  return res.json({ message: "Tokens refreshed" });
};
