import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/paymentsDB";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:");
    process.exit(1);
  }
}


/*
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;
export async function connectDB() {
    try {
        conn = await client.connect();
        console.log('MOngodb is connected');
    } catch (e) {
        console.error(e);
        console.log('Mongodb connection failure');
    }
}

let db = client.db("users");

export default db;
*/