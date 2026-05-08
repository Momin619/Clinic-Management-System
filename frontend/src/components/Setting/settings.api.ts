import { api } from "../../api/axios"; // adjust path to your axios instance
import type { User } from "../../types/auth";

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface UpdateNameResponse {
  user: User;
}

export interface UpdatePasswordResponse {
  message: string;
}

// ─── Input shapes ─────────────────────────────────────────────────────────────

export interface UpdateNameInput {
  name: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * PATCH /api/auth/me/name
 * Updates the authenticated admin's display name.
 */
export async function updateNameApi(
  data: UpdateNameInput,
): Promise<UpdateNameResponse> {
  console.log("before request");

  const response = await api.patch<UpdateNameResponse>("/auth/me/name", data);

  console.log("after request");
  console.log(response.data);

  return response.data;
}
/**
 * PATCH /api/auth/me/password
 * Updates the authenticated admin's password.
 * Sends currentPassword + newPassword + confirmPassword to backend.
 */
export async function updatePasswordApi(
  data: UpdatePasswordInput,
): Promise<UpdatePasswordResponse> {
  const response = await api.patch<UpdatePasswordResponse>(
    "/auth/me/password",
    {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    },
  );
  return response.data;
}
