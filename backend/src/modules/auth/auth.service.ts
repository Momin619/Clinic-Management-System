import Admin from "./auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/generateToken.js";

// SIGNUP
export const signupService = async (
  name: string,
  email: string,
  password: string,
) => {
  const exists = await Admin.findOne({
    $or: [{ email }, { name }],
  });

  if (exists) throw new Error("Admin already exists");

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

  if (!admin) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, admin.password);

  if (!match) throw new Error("Invalid credentials");

  const accessToken = createAccessToken(admin._id.toString());

  const refreshToken = createRefreshToken(admin._id.toString());

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
export const refreshService = (token: string) => {
  const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as {
    id: string;
  };

  const newAccessToken = createAccessToken(decoded.id);

  return newAccessToken;
};
