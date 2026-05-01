import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./modules/auth/auth.routes.js";
import { requestLogger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { CLIENT_URL } from "./config/env.js";

const app = express();

// 1️⃣ CORS (must be first for preflight requests)
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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

// 5️⃣ 404 handler (optional but recommended)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 6️⃣ Global Error Handler (MUST be last)
app.use(errorHandler);

export default app;
