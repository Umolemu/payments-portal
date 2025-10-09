export function errorHandler(err, req, res, next) {
  console.error(err); // logging - replace with winston in production
  const status = err.status || 500;

  if (process.env.NODE_ENV === "production") {
    return res.status(status).json({ error: "Internal Server Error" });
  }

  // development - include error details
  res.status(status).json({ error: err.message, stack: err.stack });
}
