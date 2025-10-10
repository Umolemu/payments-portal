import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { users, addUser, findUserByEmail } from "../db/usersDb.js";

const JWT_SECRET = process.env.JWT_SECRET || "replace-with-env-secret";

// Middleware function
export function authMiddleware(req: Request, res:Response, next:NextFunction) {
  let token;

  // 1️⃣ Try to get token from cookie (preferred)
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 2️⃣ Fallback: check Authorization header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  // 3️⃣ Reject if no token found
  if (!token) {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  // 4️⃣ Verify token
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.User = payload; // attach decoded payload to request
    next(); // proceed to next middleware/controller
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
