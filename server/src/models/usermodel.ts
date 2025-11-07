import mongoose, { Schema, Document } from "mongoose";

export type Role = "admin" | "user";

// Extend Document so Mongoose knows this is a MongoDB document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true } // auto-adds createdAt and updatedAt
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
