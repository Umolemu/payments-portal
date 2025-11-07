import { startServer } from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/conn.mjs";

await connectDB();

const rawPort = process.env.HTTPS_PORT ?? process.env.PORT ?? "5001";
const parsed = Number(rawPort);
const PORT: number = Number.isFinite(parsed) && parsed > 0 ? parsed : 5001;

startServer(PORT);
