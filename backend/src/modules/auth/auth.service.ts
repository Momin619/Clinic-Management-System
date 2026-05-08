import Admin from "./auth.model.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/generateToken.js";
import { AppError } from "../../errors/AppError.js";
import { AdminPublic } from "./auth.types.js";
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
      id: adminId,
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

export const updateNameService = async (
  userId: string,
  newName: string,
): Promise<AdminPublic> => {
  const currentAdmin = await Admin.findById(userId);

  if (!currentAdmin) throw new AppError(404, "NOT_FOUND", "Admin not found");

  // same name entered
  if (currentAdmin.name === newName) {
    throw new AppError(400, "SAME_NAME", "Please choose a different name");
  }

  // another user already has this name
  const taken = await Admin.findOne({
    name: newName,
    _id: { $ne: userId },
  });
  if (taken) {
    throw new AppError(409, "NAME_TAKEN", "That name is already taken");
  }

  currentAdmin.name = newName;

  await currentAdmin.save();

  return {
    id: currentAdmin._id.toString(),
    name: currentAdmin.name,
    email: currentAdmin.email,
  };
};

// ─── UPDATE PASSWORD ─────────────────────────────────────────────────────────

export const updatePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const admin = await Admin.findById(userId);
  if (!admin) throw new AppError(404, "NOT_FOUND", "Admin not found");

  const match = await bcrypt.compare(currentPassword, admin.password);
  if (!match)
    throw new AppError(
      401,
      "AUTH_INVALID_CREDENTIALS",
      "Current password is incorrect",
    );

  // Assign plain text — the pre-save hook hashes it automatically
  admin.password = newPassword;
  await admin.save();
};
