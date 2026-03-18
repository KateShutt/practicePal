import express from "express";
import cors from "cors";
import pool from "./db/connection.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import practiceEntryRoutes from "./routes/practiceEntryRoutes.js";
import instrumentRoutes from "./routes/instrumentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/practice-entries", practiceEntryRoutes);

app.use("/api", instrumentRoutes);
export default app;
