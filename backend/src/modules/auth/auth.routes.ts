import express from "express";
import { signup, login, refresh, me } from "./auth.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { protectRefresh } from "./refresh.middleware.js";
const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/refresh", protectRefresh, refresh);

// 🔐 protected route
authRouter.get("/me", protect, me);

export default authRouter;
