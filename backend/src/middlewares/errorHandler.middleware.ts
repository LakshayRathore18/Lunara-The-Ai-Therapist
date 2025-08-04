// This file handles centralized error handling in your Express app.
// AppError class → Creates custom, predictable errors for operational issues (like 404, validation errors).
// errorHandler middleware → Catches errors, logs them, and sends a proper JSON response.

import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger"; 

// ===================== Custom Error Class =====================
// AppError extends the built-in Error to store extra info
export class AppError extends Error {
  statusCode: number;      // HTTP status code (e.g., 404, 500)
  status: string;          // "fail" for 4xx, "error" for 5xx
  isOperational: boolean;  // Marks predictable errors (not bugs)

  constructor(message: string, statusCode: number) {
    super(message); // Call base Error constructor
    this.statusCode = statusCode;
    // 4xx → "fail", 5xx → "error"
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Removes constructor call from the stack trace for cleaner logs
    Error.captureStackTrace(this, this.constructor);
  }
}

// ===================== Global Error Middleware =====================
// This function handles all errors in one place
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1️⃣ If it's a known operational error (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // 2️⃣ Log unexpected (programming) errors for debugging
  logger.error("Unexpected error:", err);

  // 3️⃣ Respond with generic message (don’t leak internal details)
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
