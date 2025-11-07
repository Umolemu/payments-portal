import {Document,Types} from "mongoose";
// types/role.ts
export type role = "admin" | "user";

export interface UserDTO {
  name: string;
  email: string;
  password: string;
  role?: role;
}

// The full user as stored in MongoDB (with _id)
export interface IUser extends Document{
  _id: Types.ObjectId; // from MongoDB
  name: string;
  email: string;
  password: string;
  role: role;
  createdAt: Date;
  updatedAt?: Date;
}

// User object returned to client (no password)
export interface ProtectedUser {
  _id: string; // string version of _id
  name: string;
  email: string;
  role: role;
  createdAt: Date;
  updatedAt?: Date;
}
