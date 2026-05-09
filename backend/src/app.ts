import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./modules/auth/auth.routes.js";
import appointmentRouter from "./modules/appointment/appointment.routes.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { CLIENT_URL } from "./config/env.js";
import { AppError } from "./errors/AppError.js";
const app = express();

// 1️⃣ CORS (must be first for preflight requests)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2️⃣ Body parsers
app.use(express.json());
app.use(cookieParser());

// 3️⃣ Request Logger (logs ALL incoming requests)
app.use(requestLogger);

// 4️⃣ Routes
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentRouter);

// 5️⃣ 404 handler (optional but recommended)
app.use((_req, _res, next) => {
  next(new AppError(404, "NOT_FOUND", "Route not found"));
});

// 6️⃣ Global Error Handler (MUST be last)
app.use(errorHandler);

export default app;
