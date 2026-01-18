const Assessment = require("../models/Assessment");
const Player = require("../models/Player");
const Staff = require("../models/Staff");
const Branch = require("../models/Branch");
const Batch = require("../models/Batch");
const User = require("../models/User");

// =============================================
// PLAYER SKILL HISTORY (Graph Data)
// =============================================
exports.getPlayerSkillHistory = async (req, res) => {
  const { playerId } = req.params;

  const assessments = await Assessment.find({ player: playerId })
    .sort({ date: 1 });

  let timeline = {};

  assessments.forEach(a => {
    a.skillProgress.forEach(s => {
      if (!timeline[s.skillName]) timeline[s.skillName] = [];
      timeline[s.skillName].push({
        date: a.date,
        level: s.level
      });
    });
  });

  res.json(timeline);
};

// =============================================
// PLAYER SUMMARY
// =============================================
exports.getPlayerSummary = async (req, res) => {
  const player = await Player.findById(req.params.playerId)
    .populate("user")
    .populate("batch")
    .populate("branch")
    .populate({
      path: "assignedCoach",
      populate: { path: "user" }
    });

  res.json(player);
};

// =============================================
// COACH ANALYTICS
// =============================================
exports.getCoachAnalytics = async (req, res) => {
  const coach = await Staff.findOne({ user: req.user._id });

  if (!coach) return res.status(404).json({ message: "Coach not found" });

  const players = await Player.find({ assignedCoach: coach._id });

  let total = 0, count = 0;
  players.forEach(p => {
    p.skills.forEach(s => {
      total += s.level;
      count++;
    });
  });

  const avgSkill = count === 0 ? 0 : (total / count).toFixed(2);

  res.json({
    playerCount: players.length,
    avgSkill,
    players
  });
};

// =============================================
// ADMIN ANALYTICS
// =============================================
exports.getAdminAnalytics = async (req, res) => {
  const players = await Player.countDocuments();
  const staff = await Staff.countDocuments();
  const branches = await Branch.countDocuments();
  const batches = await Batch.countDocuments();

  res.json({
    players,
    staff,
    branches,
    batches
  });
};
