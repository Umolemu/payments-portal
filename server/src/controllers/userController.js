import {
  getAllUsers,
  getUserByEmail,
  createUser,
  verifyUserCredentials,
} from "../services/userService.js";

export async function getUsersController(req, res) {
  try {
    const list = await getAllUsers();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

export async function getUserController(req, res) {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export async function createUserController(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }

    const user = await createUser({ name, email, password, role });

    res.status(201).json(user);
  } catch (error) {
    if (error.message.includes("exists")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const user = await verifyUserCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to verify user" });
  }
}
