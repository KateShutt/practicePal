import express from "express";
import pool from "../db/connection.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// an endpoint that fetches all allowed instruments from the DB

router.get("/instruments", async (req, res) => {
  try {
    const [instruments] = await pool.query(
      "SELECT id, name FROM instruments ORDER BY name",
    );

    return res.json(instruments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error" });
  }
});

router.post("/addInstrument", authMiddleware, async (req, res) => {
  const { userId } = req.user;

  const instrument_id = req.body.instrument_id;

  try {
    await pool.query(
      "INSERT INTO user_instruments(user_id, instrument_id) VALUES (?,?)",
      [userId, instrument_id],
    );

    return res.json({ message: "instrument logged successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// endpoint to find all instruments associated with a particular user

router.get("/userInstruments", authMiddleware, async (req, res) => {
  const { userId } = req.user;

  try {
    const [userInstruments] = await pool.query(
      "SELECT instrument_id, name FROM user_instruments JOIN instruments ON user_instruments.instrument_id = instruments.id WHERE user_id = ?",
      [userId],
    );

    return res.json({ userInstruments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

export default router;
