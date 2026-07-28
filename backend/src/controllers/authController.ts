import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User';
import validator from 'validator';

const registerSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    phone: z.string().refine((val) => validator.isMobilePhone(val), { message: "Invalid phone number format" }),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one symbol")
});

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ errors: (parsed.error as any).errors || parsed.error.issues });
            return;
        }

        const { username, email, phone, password } = parsed.data;

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
        if (existingUser) {
            res.status(400).json({ message: "User with this username, email, or phone already exists." });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            phone,
            passwordHash
        });

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message || "Server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            res.status(400).json({ message: "Please provide identifier and password" });
            return;
        }

        // Find user by username, email, or phone
        const user = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
                { phone: identifier }
            ]
        });

        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '30d'
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message || "Server error" });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById((req as any).user.id).select('-passwordHash');
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message || "Server error" });
    }
};
