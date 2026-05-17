import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import medicineRoutes from "./routes/medicines.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import { protect } from "./middlewars/authMiddleware.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HEALTH_MESSAGE = "Medicine Reminder API is running...";

function isMedicineReminderHealthMessage(message) {
  return typeof message === "string" && message.includes(HEALTH_MESSAGE);
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

// =================== CORS ===================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// =================== Middlewares ===================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", (req, res, next) => {
  if (isDatabaseConnected()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message:
      "Database is unavailable. Start local MongoDB or whitelist your IP in MongoDB Atlas.",
  });
});

// =================== Routes ===================
app.use("/api/auth", authRoutes);
app.use("/api/medicines", protect, medicineRoutes);
app.use("/api/reminders", protect, reminderRoutes);

app.get("/", (req, res) => {
  res.json({
    message: HEALTH_MESSAGE,
    databaseConnected: isDatabaseConnected(),
  });
});

// =================== MongoDB ===================
const ATLAS_MONGO_URL = process.env.MONGO_URL;
const LOCAL_MONGO_URL =
  process.env.MONGO_LOCAL_URL || "mongodb://127.0.0.1:27017/medicine_reminder";

async function connectToMongo() {
  const connectionTargets = [];

  if (ATLAS_MONGO_URL) {
    connectionTargets.push({
      label: "MongoDB Atlas",
      url: ATLAS_MONGO_URL,
    });
  }

  if (LOCAL_MONGO_URL) {
    connectionTargets.push({
      label: "Local MongoDB",
      url: LOCAL_MONGO_URL,
    });
  }

  for (const target of connectionTargets) {
    try {
      await mongoose.connect(target.url);
      console.log(`Connected to ${target.label}`);
      return;
    } catch (err) {
      console.error(`${target.label} connection failed:`, err.message);
    }
  }

  console.error(
    "MongoDB connection failed. If you use Atlas, whitelist your IP there or run a local MongoDB instance."
  );
}

connectToMongo();

// =================== Global Error Handler ===================
app.use((err, req, res, next) => {
  console.error("FULL ERROR:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Server error",
  });
});

// =================== Server ===================
const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", async (err) => {
  if (err.code !== "EADDRINUSE") {
    console.error("Server start error:", err);
    process.exit(1);
  }

  try {
    const response = await fetch(`http://127.0.0.1:${PORT}/`);
    const data = await response.json();

    if (isMedicineReminderHealthMessage(data?.message)) {
      console.log(`Server is already running on port ${PORT}`);
      process.exit(0);
    }
  } catch {
    // Ignore the health-check error and show a clear port conflict message below.
  }

  console.error(`Port ${PORT} is already in use by another process.`);
  process.exit(1);
});
