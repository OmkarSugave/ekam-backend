// routes/attendance.js
const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");
const { staffOnly } = require("../middleware/roleMiddleware");

// STAFF ONLY
router.post("/", protect, staffOnly, markAttendance);

// STAFF + PLAYER + PARENT (role logic handled in controller)
router.get("/", protect, getAttendance);

// STAFF ONLY
router.put("/:id", protect, staffOnly, updateAttendance);

// STAFF ONLY
router.delete("/:id", protect, staffOnly, deleteAttendance);

module.exports = router;
