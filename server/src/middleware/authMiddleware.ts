import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "replace-with-env-secret";

// Extend Express Request type safely
export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  let token: string | undefined;

  // Try to get token from cookie
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Fallback: Authorization header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  // Reject if no token found
  if (!token) {
    res.status(401).json({ error: "Missing authentication token" });
    return;
  }

  // Verify token
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
