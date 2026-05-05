import { JwtPayload } from "jsonwebtoken";
import { IAdmin } from "./auth.model.js";

export interface TokenPayload extends JwtPayload {
  id: string;
}

export type AdminPublic = Pick<IAdmin, "name" | "email">;
