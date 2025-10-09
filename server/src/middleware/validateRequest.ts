import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors
      .array()
      .map((e) =>
        typeof e.msg === "string"
          ? e.msg
          : "path" in e
          ? (e as any).path
          : "validation_error"
      );
    return res.status(400).json({ errors: details });
  }
  next();
}
