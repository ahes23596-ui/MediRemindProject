import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    taken: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      required: true,
    },

    schedule: {
      type: [String],
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },

    reminderTime: {
      type: String,
    },

    repeatType: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly"],
      default: "daily",
    },

    daysOfWeek: {
      type: [String],
      default: [],
    },

    quantity: {
      type: Number,
      default: 0,
    },

    refillAlertAt: {
      type: Number,
      default: 5,
    },

    prescriptionImage: {
      type: String,
      default: null,
    },

    history: {
      type: [historySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
