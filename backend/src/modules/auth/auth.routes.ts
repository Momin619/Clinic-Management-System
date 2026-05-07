import express from "express";
import { signup, login, refresh, me, logout } from "./auth.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { signupSchema, loginSchema } from "./auth.schema.js";
import { protectRefresh } from "./refresh.middleware.js";
const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signup);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/refresh", protectRefresh, refresh);
// auth.routes.ts
authRouter.post("/logout", protect, logout);
// 🔐 protected route
authRouter.get("/me", protect, me);

export default authRouter;
