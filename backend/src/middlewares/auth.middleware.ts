import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";

// Extend Express Request type to include `user`
// By default, TypeScript doesn't know req.user exists
// This lets us safely do `req.user = user` without type errors
declare global {
  namespace Express {
    interface Request {
      user?: any; // Store the logged-in user info
    }
  }
}


// Auth middleware to protect routes
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1️⃣ Extract token from "Authorization: Bearer <token>" header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // If no token → request is unauthorized
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 2️⃣ Verify the token using secret key
    //    - Decodes payload (e.g., { userId, iat, exp })
    //    - Throws error if token is expired or invalid
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key" // Always use env in production
    ) as any;

    // 3️⃣ Find the user in DB using userId from token payload
    const user = await User.findById(decoded.userId);

    // If user not found → token might be old or tampered
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4️⃣ Attach user object to req so next handlers know who is logged in
    req.user = user;

    // 5️⃣ Move to the next middleware / controller
    next();

  } catch (error) {
    // Any error = Invalid or expired token
    res.status(401).json({ message: "Invalid authentication token" });
  }
};
