import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const authenticate = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization?.startsWith("Bearer ")) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }
        const token = authorization.substring(7);
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (typeof decoded === "string" || !decoded.userId) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
