import xss from "xss";
import express from "express";

export const sanitize = (
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction
) => {
  const sanitizeValue = (val: unknown): unknown => {
    if (typeof val === "string") return xss(val);
    if (Array.isArray(val)) return val.map(sanitizeValue);
    if (val && typeof val === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        out[k] = sanitizeValue(v);
      }
      return out;
    }
    return val;
  };

  //mutates reassign instead of reassigning it
  if (req.body && typeof req.body === "object") {
    Object.assign(req.body, sanitizeValue(req.body));
  }
  if (req.query && typeof req.query === "object") {
    Object.assign(req.query, sanitizeValue(req.query));
  }
  if (req.params && typeof req.params === "object") {
    Object.assign(req.params, sanitizeValue(req.params));
  }

  next();
};
