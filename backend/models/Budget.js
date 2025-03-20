const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        ref: "User",
        required: true, // Each transaction must be linked to a user
    },
    budgetId: {
        type: String,
        required: true, // Each transaction must be linked to a user
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Housing", "Food & Dining", "Transportation", "Utilities",
        "Entertainment", "Shopping", "Health & Fitness", "Personal Care",
        "Education", "Travel", "Debt Payments", "Savings", "Gifts & Donations",
        "Subscriptions", "Other"
      ],
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    customCategory: {
      type: String,
      required: function () {
        return this.category === "Other";
      }
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    notes: {
      type: String,
      maxlength: 500
    },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
