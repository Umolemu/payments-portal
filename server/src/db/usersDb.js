export const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "user",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Carol Martinez",
    email: "carol@example.com",
    role: "auditor",
    createdAt: new Date().toISOString(),
  },
];

export var nextId = users.length + 1;

export function resetUsers() {
  users.splice(0, users.length);
  nextId = 1;
}
