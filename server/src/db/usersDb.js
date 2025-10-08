import bcrypt from "bcrypt";
import { saltRounds } from "../constants/constants.js";

const testPassword = "password123";
const hashedPassword = bcrypt.hashSync(testPassword, saltRounds);

export const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Carol Martinez",
    email: "carol@example.com",
    password: hashedPassword,
    role: "user",
    createdAt: new Date().toISOString(),
  },
];

let nextId = users.length + 1;

export function addUser({ name, email, role = "user", password }) {
  const user = {
    id: nextId++,
    name,
    email,
    role,
    password,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function findUserByEmail(email) {
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
