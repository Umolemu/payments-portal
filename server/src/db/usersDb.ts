import bcrypt from "bcrypt";
import type { User } from "../types/user.js";
import type { role } from "../types/role.js";
import { saltRounds } from "../constants/constants.js";

const testPassword = "password123";
const hashedPassword = bcrypt.hashSync(testPassword, saltRounds);

export const users: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    password: hashedPassword,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    password: hashedPassword,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Carol Martinez",
    email: "carol@example.com",
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
  },
];

let nextId = users.length + 1;

export function addUser({
  name,
  email,
  role = "user",
  password,
}: {
  name: string;
  email: string;
  role?: role;
  password: string;
}): User {
  const user: User = {
    id: nextId++,
    name,
    email,
    role,
    password,
    createdAt: new Date(),
  };
  users.push(user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase().trim()
  );
}

export function resetUsers() {
  users.splice(0, users.length);
  nextId = 1;
}

export function _getNextIdUnsafe() {
  return nextId;
}
