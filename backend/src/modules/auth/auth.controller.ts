import { Request, Response } from "express";
import { signupService, loginService, refreshService } from "./auth.service.js";
import jwt from "jsonwebtoken";
import Admin from "./auth.model.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config/env.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../../config/cookieConfig.js";

import { TokenPayload, AuthRequest } from "./auth.types.js";

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

export const me = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "No user in request" });
  }

  const user = await Admin.findById(userId).select("name email");

  res.json({ user });
};

// REFRESH TOKEN
export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    // verify old refresh token
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
    ) as TokenPayload;

    const userId = decoded.id;

    // 🔥 generate NEW tokens
    const newAccessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // 🔐 overwrite cookies
    res.cookie("accessToken", newAccessToken, accessCookieOptions);

    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.json({ message: "Tokens refreshed" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
