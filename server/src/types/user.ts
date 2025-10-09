import type { role } from "./role.js";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: role;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProtectedUser {
  id: number;
  name: string;
  email: string;
  role: role;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserDTO {
  name: string;
  email: string;
  password: string;
  role?: role;
}
