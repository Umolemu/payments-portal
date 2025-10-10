import express from "express";
import https from "https";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { options } from "./utils/serverOptions.js";
import { sanitize } from "./utils/sanitize.js";
import { setCsrfToken, verifyCsrf, getCsrfToken } from "./middleware/csrf.js";

dotenv.config();

const app = express();
// If behind a reverse proxy (e.g., Azure App Service/NGINX), trust proxy so secure cookies are respected
app.set("trust proxy", 1);
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
app.use(
  helmet({
    // Mitigate clickjacking: block all framing
    frameguard: { action: "deny" },
    // Strong referrer policy
    referrerPolicy: { policy: "no-referrer" },
    // Content Security Policy with frame-ancestors none
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Prevent this app from being framed anywhere
        "frame-ancestors": ["'none'"],
      },
    },
  })
); // sets many secure headers
app.use(sanitize); // sanitize user input against XSS
app.use(express.json({ limit: "10kb" }));
app.use(globalLimiter);
// CSRF protections: double-submit cookie (cookie + x-csrf-token header)
app.use(setCsrfToken);
app.get("/csrf", getCsrfToken);
app.use(verifyCsrf);
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("Payments Portal API running over HTTPS");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api", paymentRoutes);
app.use(errorHandler);

export function startServer(PORT: number) {
  const server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`✅ HTTPS server running on https://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
}
