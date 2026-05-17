import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicineName: {
      type: String,
      required: true,
      trim: true,
    },

    dose: {
      type: String,
      required: [true, "Dosage information is required"],
    },

    time: {
      type: String,
      required: true,
    },

    repeat: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly"],
      default: "once",
    },

    note: {
      type: String,
      default: "",
    },

    isImportant: {
      type: Boolean,
      default: false,
    },

    isDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reminder", reminderSchema);
