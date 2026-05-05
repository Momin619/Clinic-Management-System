import Admin from "./auth.model.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/generateToken.js";
import { AppError } from "../../errors/AppError.js";
// SIGNUP
export const signupService = async (
  name: string,
  email: string,
  password: string,
) => {
  const exists = await Admin.findOne({
    $or: [{ email }, { name }],
  });

  if (exists)
    throw new AppError(409, "AUTH_EMAIL_TAKEN", "Email is already registered");

  const admin = await Admin.create({
    name,
    email,
    password,
  });
  return {
    name: admin.name,
    email: admin.email,
  };
};

// LOGIN
export const loginService = async (identifier: string, password: string) => {
  const admin = await Admin.findOne({
    $or: [{ email: identifier }, { name: identifier }],
  });

  if (!admin)
    throw new AppError(401, "AUTH_INVALID_CREDENTIALS", "Invalid credentials");

  const match = await bcrypt.compare(password, admin.password);

  if (!match)
    throw new AppError(401, "AUTH_INVALID_CREDENTIALS", "Invalid credentials");

  const adminId = admin._id.toString();

  const accessToken = createAccessToken(adminId);

  const refreshToken = createRefreshToken(adminId);

  return {
    user: {
      name: admin.name,
      email: admin.email,
    },
    accessToken,
    refreshToken,
  };
};

// REFRESH
export const refreshService = (userId: string) => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  return { accessToken, refreshToken };
};
