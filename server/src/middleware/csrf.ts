import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

const TOKEN_COOKIE = "XSRF-TOKEN";
const TOKEN_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function setCsrfToken(req: Request, res: Response, next: NextFunction) {
  const existing = req.cookies?.[TOKEN_COOKIE];
  const token = existing || crypto.randomBytes(32).toString("hex");
  if (!existing) {
    res.cookie(TOKEN_COOKIE, token, {
      httpOnly: false, // has to be readable by client
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
  }
  (req as any).csrfToken = token;
  next();
}

export function verifyCsrf(req: Request, res: Response, next: NextFunction) {
  if (SAFE_METHODS.has(req.method)) return next();
  const header = req.get(TOKEN_HEADER) || req.get(TOKEN_HEADER.toUpperCase());
  const cookie = req.cookies?.[TOKEN_COOKIE];
  if (!header || !cookie || header !== cookie) {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }
  next();
}

export function getCsrfToken(req: Request, res: Response) {
  const token = (req as any).csrfToken as string | undefined;
  res.json({ csrfToken: token });
}
