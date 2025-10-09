import { startServer } from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5001;

startServer(PORT);
