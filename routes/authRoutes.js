const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  deleteUser
} = require("../controllers/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;