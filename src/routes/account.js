const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

const Player = require("../models/Player");

const {
  updateProfile,
  changePassword,
  submitFees
} = require("../controllers/accountController");

// ================= PROFILE =================

// Update profile
router.put("/update-profile", auth, updateProfile);

// Change password
router.put("/change-password", auth, changePassword);

// ================= PARENT → PLAYER =================
// Get parent-linked player (CRITICAL FOR FEES PAGE)
router.get("/my-child", auth, async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Access denied" });
    }

    const player = await Player.findOne({ parents: req.user._id })
      .populate("user")
      .populate("batch")
      .populate("branch");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= FEES =================
// Parent submits fee payment proof
router.post(
  "/fees/submit",
  auth,
  upload.single("receipt"),
  submitFees
);

module.exports = router;
