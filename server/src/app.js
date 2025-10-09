import express from "express";
import fs from "fs";
import https from "https";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; 

dotenv.config();

const app = express();

app.use(cookieParser());  
app.use(express.json());

// Basic hardening middlewares
app.use(helmet()); // sets many secure headers, including HSTS by default
app.use(xss()); // sanitize user input against XSS
app.use(express.json({ limit: "10kb" })); // limit request body size

// CORS - restrict to allowed origin(s)
const allowedOrigin = process.env.FRONTEND_ORIGIN || "https://localhost:3000";
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Rate limiting (global)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: "Too many requests, try later." }),
});
app.use(globalLimiter);

// Health check
app.get("/", (req, res) => {
  res.send("Payments Portal API running over HTTPS");
});

// Routes
app.use("/api/users", userRoutes);

// Centralized error handler (should be after routes)
app.use(errorHandler);

// HTTPS options - NOTE: check filename typo below
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH || "keys/privateKey.pem"),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH || "keys/certificate.pem"),
  minVersion: "TLSv1.2", // require TLS 1.2+
};

// Export function that starts the HTTPS server
export function startServer(PORT) {
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
