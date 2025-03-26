const express = require("express");
const Transaction = require("../models/Transactions");


const router = express.Router();

// ✅ Create a new transaction
router.post("/", async (req, res) => {
  try {
    const { userId, transactionId, type, description, amount, category, date, account } = req.body;
    const newTransaction = new Transaction({ userId, transactionId, type, description, amount, category, date, account });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
});

// ✅ Get all transactions for a user
router.get("/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});
module.exports = router;

