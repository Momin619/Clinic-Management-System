import { JwtPayload } from "jsonwebtoken";

import { Request } from "express";
export interface TokenPayload extends JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}
