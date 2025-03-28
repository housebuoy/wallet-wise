const express = require("express");
const connectDB = require("./database");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON data
app.use(cors()); // Allow API access from frontend

// Connect to MongoDB
connectDB();

// Route to post or get users
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transaction");
const budgetRoutes = require("./routes/budgetRoutes");
const savingsRoutes = require("./routes/savingsRoutes");
app.use("/api", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/savings", savingsRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
