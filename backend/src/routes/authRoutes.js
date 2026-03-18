import express from "express";
import bcrypt from "bcrypt";
import pool from "../db/connection.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const formData = req.body || {};

  const { username, password, confirmPassword } = req.body || {};

  const allowedFields = new Set(["username", "password", "confirmPassword"]);

  // validation logic

  for (let key of Object.keys(formData)) {
    if (!allowedFields.has(key)) {
      return res.status(400).json({ error: "unknown fields not allowed!" });
    }
  }

  if (typeof username !== "string" || username === "") {
    return res
      .status(400)
      .json({ error: "username must be a non-empty string" });
  }

  if (typeof password !== "string" || password === "") {
    return res
      .status(400)
      .json({ error: "password must be a non-empty string" });
  } else if (password.length < 10) {
    return res
      .status(400)
      .json({ error: "password must be at least 10 characters long" });
  } else if (!/[A-Z]/.test(password)) {
    return res
      .status(400)
      .json({ error: "password mut contain at least one uppercase character" });
  } else if (!/[0-9]/.test(password)) {
    return res
      .status(400)
      .json({ error: "password must contain at least one number" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "passwords must match" });
  }

  // Database logic

  try {
    const [existingUsers] = await pool.query(
      "SELECT id from users WHERE username = ?",
      [username],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "user already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const data = await pool.query(
      "INSERT INTO users(username, password_hash) VALUES (?,?)",
      [username, passwordHash],
    );

    return res
      .status(200)
      .json({ message: "user registered successfully", data });
  } catch (error) {
    console.error(error.response?.data || error);
    return res.status(400).json({ error: "server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    const allowedFields = new Set(["username", "password"]);

    for (let key of Object.keys(req.body || {})) {
      if (!allowedFields.has(key)) {
        return res.status(400).json({ error: "unknown fields not allowed" });
      }
    }

    // validate input

    if (typeof username !== "string" || username === "") {
      return res
        .status(400)
        .json({ error: "username must be a non empty string" });
    }

    if (typeof password !== "string" || password === "") {
      return res
        .status(400)
        .json({ error: "password must be a non empty string" });
    }

    //confirming user exists

    const [users] = await pool.query(
      "SELECT id, username,password_hash FROM users WHERE username = ?",
      [username],
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "invalid username or password" }); // do not reveal which one is wrong
    }

    // confirming password is correct

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(400).json({ error: "invalid username or password" });
    }

    //generate JWT token

    const token = jwt.sign(
      { userId: user.id }, //data stored in token
      process.env.JWT_SECRET, // secret used to sign it
      { expiresIn: "1h" }, // expiration time
    );

    return res.status(200).json({
      message: "login successful",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("login error", error);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;
