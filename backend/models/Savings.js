const mongoose = require("mongoose");

const SavingsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true, // Each transaction must be linked to a user
    },
    savingGoalId: {
      type: String,
      required: true, // Each transaction must be linked to a user
    },
    goalName: {
      type: String,
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    targetAmount: {
        type: Number,
        required: true, // Must be specified as a target amount
    },
    initialAmount: {
        type: Number,
        default: 0, // Optional: Defaults to 0 if not provided
      },
    allocationAmount: {
        type: Number,
        default: 0, // Optional: Defaults to 0 if not provided
        required: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Savings", SavingsSchema);
