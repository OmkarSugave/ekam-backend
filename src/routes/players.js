const express = require("express");
const router = express.Router();
const { auth, role } = require("../middlewares/auth");

const {
  getPlayerDashboard,
  getParentChildDashboard,
  getMySchedule,
  getMyAttendance,
  getPlayerAssessments
} = require("../controllers/playerController");

const { getNotifications } = require("../controllers/notificationController");
const {
  getPlayerSkillHistory,
  getPlayerSummary
} = require("../controllers/reportController");

// ----------------- PLAYER DASHBOARD --------
router.get("/dashboard", auth, role("player"), getPlayerDashboard);

// ----------------- PARENT CHILD DASHBOARD ---
router.get("/child/:id", auth, role("parent"), getParentChildDashboard);

// ----------------- PLAYER SCHEDULE (✅ FIXED) ----------
router.get("/my-schedule", auth, role("player"), getMySchedule);

// ----------------- PLAYER ATTENDANCE ----------
router.get("/my-attendance", auth, role("player"), getMyAttendance);

// ----------------- PLAYER ASSESSMENTS -------
router.get("/assessments", auth, role("player"), getPlayerAssessments);

// ----------------- PLAYER NOTIFICATIONS -----
router.get("/notifications", auth, getNotifications);

// ----------------- PLAYER REPORTS -----------
router.get("/summary/:playerId", auth, getPlayerSummary);
router.get("/skill-history/:playerId", auth, getPlayerSkillHistory);

module.exports = router;
