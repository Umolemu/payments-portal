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
  // mutate shallowly; express.json already parsed these
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).body = sanitizeValue(req.body);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).query = sanitizeValue(req.query);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).params = sanitizeValue(req.params);
  next();
};
