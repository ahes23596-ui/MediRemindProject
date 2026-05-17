import express from "express";
import {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  toggleDone,
} from "../controllers/reminderController.js";
import { protect } from "../middlewars/authMiddleware.js"; // لاحظ .js

const router = express.Router();

router.get("/", protect, getReminders);
router.post("/", protect, createReminder);
router.put("/:id", protect, updateReminder);
router.patch("/:id/toggle", protect, toggleDone);
router.delete("/:id", protect, deleteReminder);

export default router;
