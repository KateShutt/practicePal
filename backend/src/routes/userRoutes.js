import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../db/connection.js";

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  const userId = req.user.userId; // authMiddleware verifies the JWT tokena dn attaches the decoded payload
  // we extract the authenticated juser's ID from req.user

  try {
    const [users] = await pool.query(
      "SELECT id, username FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(users[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
