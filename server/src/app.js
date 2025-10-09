import express from "express";
import fs from "fs";
import https from "https";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Payments Portal API running over HTTPS");
});

// Routes
app.use("/api/users", userRoutes);

// HTTPS options
const options = {
  key: fs.readFileSync("keys/privateKey.pem"),
  cert: fs.readFileSync("keys/certifecate.pem"),
};

// Export function that starts the HTTPS server
export function startServer(PORT) {
  const server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`✅ HTTPS server running on https://localhost:${PORT}`);
  });
}

export default app;
