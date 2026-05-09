import { api } from "../../api/axios"; // adjust path to your axios instance
import type { User } from "../../types/auth";

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface UpdateNameResponse {
  user: User;
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
// ✅ needs .result — controller sends data payload
export async function updateNameApi(
  data: UpdateNameInput,
): Promise<UpdateNameResponse> {
  const response = await api.patch("/auth/me/name", data);
  return response.data.result; // { user }
}

// ✅ no .result — controller sends message-only
export async function updatePasswordApi(
  data: UpdatePasswordInput,
): Promise<void> {
  await api.patch("/auth/me/password", data);
  // nothing useful to return; the component only cares if it throws or not
}
