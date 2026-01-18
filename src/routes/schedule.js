// routes/schedule.js
const express = require("express");
const router = express.Router();

const {
  createSchedule,
  getScheduleByPlayer,
  updateSchedule,
  deleteSchedule
} = require("../controllers/scheduleController");

const { protect } = require("../middleware/authMiddleware");
const { staffOnly } = require("../middleware/roleMiddleware");

// STAFF ONLY
router.post("/", protect, staffOnly, createSchedule);

// STAFF + PLAYER (player can view own schedule)
router.get("/:playerId", protect, getScheduleByPlayer);

// STAFF ONLY
router.put("/:id", protect, staffOnly, updateSchedule);

// STAFF ONLY
router.delete("/:id", protect, staffOnly, deleteSchedule);

module.exports = router;
