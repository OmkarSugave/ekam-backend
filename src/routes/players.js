const express = require("express");
const router = express.Router();
const { auth, role } = require("../middlewares/auth");

const {
  getPlayerDashboard,
  getParentChildDashboard,
  getPlayerSchedule,
  getPlayerAssessments,
  getPlayerAttendance
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

// ----------------- PLAYER SCHEDULE ----------
router.get("/schedule", auth, role("player"), getPlayerSchedule);

// ----------------- PLAYER ASSESSMENTS -------
router.get("/assessments", auth, role("player"), getPlayerAssessments);

// ----------------- PLAYER ATTENDANCE --------
router.get("/attendance", auth, role("player"), getPlayerAttendance);

// ----------------- PLAYER NOTIFICATIONS -----
router.get("/notifications", auth, role("player","parent"), getNotifications);

// ----------------- PLAYER REPORTS -----------
router.get("/summary/:playerId", auth, getPlayerSummary);
router.get("/skill-history/:playerId", auth, getPlayerSkillHistory);
const { getMyAttendance } = require("../controllers/playerController");

router.get("/my-attendance", auth, getMyAttendance);
const { getMySchedule } = require("../controllers/playerController");

router.get("/my-schedule", auth, getMySchedule);

module.exports = router;
