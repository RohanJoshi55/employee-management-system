const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employeeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/", employeeRoutes);
app.use("/auth", authRoutes);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});