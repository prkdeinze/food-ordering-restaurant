const express = require("express");

const {
  register,
  login,
  getCurrentUser,
} = require("../Controllers/auth.controller");

const {
  authMiddleware,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Get currently logged-in user
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
