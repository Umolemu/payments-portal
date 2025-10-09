import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err); // logging - replace with winston in production

  // Safely derive status
  const statusCandidate =
    typeof err === "object" && err !== null
      ? "status" in err && typeof (err as any).status === "number"
        ? (err as any).status
        : "statusCode" in err && typeof (err as any).statusCode === "number"
        ? (err as any).statusCode
        : undefined
      : undefined;
  const status = statusCandidate ?? 500;

  if (process.env.NODE_ENV === "production") {
    return res.status(status).json({ error: "Internal Server Error" });
  }

  // development - include error details
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  res.status(status).json({ error: message, stack });
};
