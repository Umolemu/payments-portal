import express from "express";
import fs from "fs";
import https from "https";
import helmet from "helmet";
// xss-clean is deprecated; use a small sanitizer middleware built on 'xss'
import xss from "xss";
import rateLimit from "express-rate-limit";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const allowedOrigin = process.env.FRONTEND_ORIGIN || "https://localhost:3000";
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    res.status(429).json({ error: "Too many requests, try later." }),
});

app.use(cookieParser());
app.use(express.json());

// Basic hardening middlewares
app.use(helmet()); // sets many secure headers,
// Simple sanitizer middleware: sanitize string fields in body, query, and params
const sanitize = (
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
app.use(sanitize); // sanitize user input against XSS
app.use(express.json({ limit: "10kb" })); // limit request body size

// CORS - restrict to allowed origin(s)
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(globalLimiter);

// Health check
app.get("/", (req, res) => {
  res.send("Payments Portal API running over HTTPS");
});

// Routes
app.use("/api/users", userRoutes);

// Centralized error handler (should be after routes)
app.use(errorHandler);

// Resolve first existing file from a list of candidates
function resolveFirstExisting(candidates: Array<string | undefined>): string {
  for (const p of candidates) {
    if (!p) continue;
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore and try next
    }
  }
  const tried = candidates.filter(Boolean).join(", ");
  throw new Error(`No valid file found. Tried: ${tried}`);
}

// HTTPS options - supports common filename variants and env overrides
const keyPath = resolveFirstExisting([
  process.env.SSL_KEY_PATH,
  "keys/privateKey.pem",
  "keys/privatekey.pem",
]);
const certPath = resolveFirstExisting([
  process.env.SSL_CERT_PATH,
  "keys/certificate.pem",
  "keys/certifecate.pem",
]);

const options: https.ServerOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  minVersion: "TLSv1.2",
};

// Export function that starts the HTTPS server
export function startServer(PORT: number) {
  const server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`✅ HTTPS server running on https://localhost:${PORT}`);
  });

  // optional: handle server errors
  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}

export default app;
