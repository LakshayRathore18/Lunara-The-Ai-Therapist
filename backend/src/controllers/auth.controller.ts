import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { Session } from '../models/Session.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Create JWT + DB Session
const createSession = async (userId: string, userAgent?: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "24h" });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await new Session({
        userId,
        token,
        expiresAt,
        deviceInfo: userAgent,
    }).save();

    return token;
};

// ===================== SIGNUP =====================
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Validate
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, Email, and Password are required" });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = await new User({ name, email, password: hashedPassword }).save();

        // Auto-login after signup (Optional)
        const token = await createSession((user as any)._id.toString(), req.headers["user-agent"]);

        return res.status(201).json({
            user: { _id: (user as any)._id, name: user.name, email: user.email },
            token,
            message: "User registered successfully.",
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// ===================== LOGIN =====================
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Create session + token
        const token = await createSession((user as any)._id.toString(), req.headers["user-agent"]);

        return res.json({
            user: { _id: (user as any)._id, name: user.name, email: user.email },
            token,
            message: "Login successful",
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// ===================== LOGOUT =====================
export const logout = async (req: Request, res: Response) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            await Session.deleteOne({ token }); // Remove session from DB
        }

        return res.json({ message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
