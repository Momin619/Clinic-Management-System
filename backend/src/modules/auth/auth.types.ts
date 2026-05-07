import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  id: string;
}

export type AdminPublic = {
  id: string;
  name: string;
  email: string;
};
