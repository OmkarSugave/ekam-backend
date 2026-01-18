const express = require("express");
const router = express.Router();
const { auth, role } = require("../middlewares/auth");

const {
  getAssignedPlayers,
  getPlayerDetailsByCoach
} = require("../controllers/staffController");

const {
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getPlayerSchedule
} = require("../controllers/scheduleController");

const {
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendance
} = require("../controllers/attendanceController");

const {
  addAssessment,
  updateAssessment,
  deleteAssessment,
  getPlayerAssessments
} = require("../controllers/assessmentController");

const { getNotifications } = require("../controllers/notificationController");

const { getCoachAnalytics } = require("../controllers/reportController");

// ----------------- STAFF PLAYERS ----------
router.get("/players", auth, role("staff"), getAssignedPlayers);
router.get("/player/:id", auth, role("staff"), getPlayerDetailsByCoach);

// ----------------- SCHEDULE ---------------
router.post("/schedule", auth, role("staff", "admin"), addSchedule);
router.put("/schedule/:id", auth, role("staff", "admin"), updateSchedule);
router.delete("/schedule/:id", auth, role("staff", "admin"), deleteSchedule);
router.get("/schedule/:playerId", auth, role("staff", "admin", "player"), getPlayerSchedule);

// ----------------- ATTENDANCE -------------
router.post("/attendance", auth, role("staff", "admin"), markAttendance);
router.put("/attendance/:id", auth, role("staff", "admin"), updateAttendance);
router.delete("/attendance/:id", auth, role("staff", "admin"), deleteAttendance);
router.get("/attendance", auth, role("staff", "admin"), getAttendance);

// ----------------- ASSESSMENTS ------------
router.post("/assessment", auth, role("staff", "admin"), addAssessment);
router.put("/assessment/:id", auth, role("staff", "admin"), updateAssessment);
router.delete("/assessment/:id", auth, role("staff", "admin"), deleteAssessment);
router.get("/assessments/:playerId", auth, role("staff", "admin"), getPlayerAssessments);

// ----------------- NOTIFICATIONS ----------
router.get("/notifications", auth, role("staff"), getNotifications);

// ----------------- COACH ANALYTICS --------
router.get("/analytics/coach", auth, role("staff","admin"), getCoachAnalytics);

module.exports = router;
