import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Payments Portal API running");
});

app.use("/api/users", userRoutes);

export default app;
