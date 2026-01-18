const express = require("express");
const router = express.Router();
const { login, getProfile } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");

// Login
router.post("/login", login);

// User Profile
router.get("/profile", auth, getProfile);

module.exports = router;
