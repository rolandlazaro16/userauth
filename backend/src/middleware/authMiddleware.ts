import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token) throw new Error("No token");
            const decoded = jwt.verify(token, (process.env.JWT_SECRET as string) || 'secret123');
            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
