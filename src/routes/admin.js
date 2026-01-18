const express = require("express");
const router = express.Router();

const { auth, role } = require("../middlewares/auth");

// ================= CONTROLLERS =================

// Branch / Batch / Staff / Player / Tournament
const {
  getBranches, addBranch, updateBranch, deleteBranch,
  getBatches, addBatch, updateBatch, deleteBatch,
  getStaffList, addStaff, updateStaff, deleteStaff,
  getPlayerList, addPlayer, updatePlayer, deletePlayer,
  getTournaments, addTournament, updateTournament, deleteTournament
} = require("../controllers/adminController");

// Notifications
const {
  createNotification,
  getNotifications,
  deleteNotification
} = require("../controllers/notificationController");

// Fees (FIXED)
const {
  getFeePlayers,
  updateFeeStatus,
  deleteFeeReceipt,
  verifyFees
} = require("../controllers/feeController");

// Account
const { adminResetPassword } = require("../controllers/accountController");

// Reports
const { getAdminAnalytics } = require("../controllers/reportController");


// ================= BRANCH =================
router.get("/branches", auth, role("admin"), getBranches);
router.post("/branches", auth, role("admin"), addBranch);
router.put("/branches/:id", auth, role("admin"), updateBranch);
router.delete("/branches/:id", auth, role("admin"), deleteBranch);

// ================= BATCH ==================
router.get("/batches", auth, role("admin"), getBatches);
router.post("/batches", auth, role("admin"), addBatch);
router.put("/batches/:id", auth, role("admin"), updateBatch);
router.delete("/batches/:id", auth, role("admin"), deleteBatch);

// ================= STAFF ==================
router.get("/staff", auth, role("admin"), getStaffList);
router.post("/staff", auth, role("admin"), addStaff);
router.put("/staff/:id", auth, role("admin"), updateStaff);
router.delete("/staff/:id", auth, role("admin"), deleteStaff);

// ================= PLAYERS ================
router.get("/players", auth, role("admin"), getPlayerList);
router.post("/players", auth, role("admin"), addPlayer);
router.put("/players/:id", auth, role("admin"), updatePlayer);
router.delete("/players/:id", auth, role("admin"), deletePlayer);

// ================= TOURNAMENTS ============
router.get("/tournaments", auth, role("admin"), getTournaments);
router.post("/tournaments", auth, role("admin"), addTournament);
router.put("/tournaments/:id", auth, role("admin"), updateTournament);
router.delete("/tournaments/:id", auth, role("admin"), deleteTournament);

// ================= NOTIFICATIONS ==========
router.post("/notifications", auth, role("admin"), createNotification);
router.get("/notifications", auth, role("admin"), getNotifications);
router.delete("/notifications/:id", auth, role("admin"), deleteNotification);

// ================= FEES ===================

// List players with fee info
router.get("/fees", auth, role("admin"), getFeePlayers);

// Optional manual override
router.put("/fees/status/:playerId", auth, role("admin"), updateFeeStatus);

// Reset fees (delete receipt)
router.delete(
  "/fees/receipt/:playerId",
  auth,
  role("admin"),
  deleteFeeReceipt
);

// ✅ VERIFY FEES (IMPORTANT)
router.put(
  "/fees/verify/:playerId",
  auth,
  role("admin"),
  verifyFees
);

// ================= ANALYTICS ===============
router.get("/analytics/admin", auth, role("admin"), getAdminAnalytics);

// ================= ADMIN RESET PASSWORD ====
router.put(
  "/reset-password/:userId",
  auth,
  role("admin"),
  adminResetPassword
);

module.exports = router;
