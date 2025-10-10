import dotenv from "dotenv";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
};

console.log(JWT_SECRET);
// Extend Express Request type safely
export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  let token: string | undefined;

  // Try to get token from cookie
  if (req.cookies && req.cookies['__Host-accessToken']) {
    token = req.cookies['__Host-accessToken'];
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
    const payload = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();

  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
