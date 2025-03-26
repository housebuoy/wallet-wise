const express = require("express");
const Savings = require("../models/Savings"); // Import the correct model

const router = express.Router();

// ✅ Create a new saving goal
router.post("/", async (req, res) => {
  try {
    const { userId, savingGoalId, goalName, targetAmount, initialAmount, date } = req.body;
    const newSaving = new Savings({ userId, savingGoalId, goalName, targetAmount, initialAmount, date });
    await newSaving.save();
    res.status(201).json(newSaving);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Get all savings goals for a user
router.get("/:userId", async (req, res) => {
  try {
    const savings = await Savings.find({ userId: req.params.userId });
    res.json(savings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching savings", error });
  }
});

// ✅ Update a saving goal
router.put("/:savingGoalId", async (req, res) => {
  try {
    const { goalName, targetAmount, initialAmount, date } = req.body;
    const updatedSaving = await Savings.findOneAndUpdate(
      { savingGoalId: req.params.savingGoalId },
      { goalName, targetAmount, initialAmount, date },
      { new: true, runValidators: true } // Returns updated document and applies validation
    );

    if (!updatedSaving) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    res.json(updatedSaving);
  } catch (error) {
    console.error("Error updating savings goal:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ Delete a saving goal
router.delete("/:savingGoalId", async (req, res) => {
  try {
    const deletedSaving = await Savings.findOneAndDelete({ savingGoalId: req.params.savingGoalId });

    if (!deletedSaving) {
      return res.status(404).json({ message: "Saving goal not found" });
    }

    res.json({ message: "Saving goal deleted successfully" });
  } catch (error) {
    console.error("Error deleting savings goal:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
