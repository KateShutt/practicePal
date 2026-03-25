import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../db/connection.js";

const router = express.Router();

const allowedCategories = new Set([
  "Scales",
  "Technique",
  "Sight Reading",
  "Repertoire",

  "Improvisation",
]);

const allowedFields = new Set([
  "practice_date",
  "duration_minutes",
  "category",
  "instrument_id",
  "piece_title",
  "notes",
]);

router.post("/", authMiddleware, async (req, res) => {
  const {
    practice_date,
    duration_minutes,
    category,
    instrument_id = null,
    piece_title = null,
    notes = null,
  } = req.body || {};

  const { userId } = req.user;

  for (let key of Object.keys(req.body || {})) {
    if (!allowedFields.has(key)) {
      return res.status(400).json({ message: "unknown fields not allowed!" });
    }
  }

  if (typeof practice_date !== "string" || practice_date === "") {
    return res.status(400).json({ message: "practice date must be a string!" });
  }

  const submittedDate = new Date(practice_date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  submittedDate.setHours(0, 0, 0, 0);

  if (submittedDate > today) {
    return res
      .status(400)
      .json({ message: "practice date cannot be in the future!" });
  }

  if (
    typeof duration_minutes !== "number" ||
    duration_minutes <= 0 ||
    !Number.isInteger(duration_minutes)
  ) {
    return res.status(400).json({
      message: "practice duration must be an inteher greater than zero",
    });
  }

  if (typeof category !== "string" || category === "") {
    return res
      .status(400)
      .json({ message: "category must be a non empty string" });
  }

  if (!allowedCategories.has(category)) {
    return res.status(400).json({ message: "unknown categories not allowed" });
  }

  try {
    await pool.query(
      "INSERT INTO practice_entries(user_id, practice_date, duration_minutes, category,instrument_id, piece_title, notes) VALUES (?,?,?,?,?,?,?)",
      [
        userId,
        practice_date,
        duration_minutes,
        category,
        instrument_id,
        piece_title,
        notes,
      ],
    );

    return res.json({ message: "session logged successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    const [entries] = await pool.query(
      "SELECT practice_date, duration_minutes, category, name, piece_title, notes FROM practice_entries JOIN instruments ON practice_entries.instrument_id = instruments.id WHERE practice_entries.user_id = ? ORDER BY practice_date DESC",
      [userId],
    );

    return res.json({ message: "data retrieved successfully", entries });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

router.get("/summary/week", authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    const [rows] = await pool.query(
      "SELECT SUM(duration_minutes) AS weekly_total FROM practice_entries WHERE user_id = ? AND practice_date >= CURDATE() - INTERVAL 7 DAY",
      [userId],
    );

    const weeklyTotal = rows[0].weekly_total || 0; // we may not have any practice entries in the last 7 days

    return res.json({
      message: "weekly total retrieved successfully",
      weeklyTotal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

router.get("/summary/daily", authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    const [rows] = await pool.query(
      "SELECT practice_date, SUM(duration_minutes) AS daily_total FROM practice_entries WHERE user_id = ?  AND practice_date >= CURDATE() - INTERVAL 7 DAY GROUP BY practice_date ORDER BY practice_date DESC",
      [userId],
    );

    const dailySummary = rows;

    return res.json({
      message: "daily summary retrieved successfully",
      dailySummary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

router.get("/summary/perInstrument", authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    const [rows] = await pool.query(
      "SELECT SUM(duration_minutes) as instrument_weekly_total, name FROM practice_entries JOIN instruments ON practice_entries.instrument_id = instruments.id WHERE user_id = ? AND practice_date >= CURDATE() - INTERVAL 7 DAY GROUP BY name ORDER BY instrument_weekly_total DESC",
      [userId],
    );

    const perInstrumentTotal = rows;

    return res.json({
      message: "weekly per instrument retrieved succesfully",
      perInstrumentTotal,
    });
  } catch (error) {
    console.error(error.response?.data);
    return res.status(500).json({ message: "server error" });
  }
});
export default router;
