const Player = require("../models/Player");
const Schedule = require("../models/Schedule");
const Assessment = require("../models/Assessment");
const Attendance = require("../models/Attendance");

// =========================================
// GET PLAYER DASHBOARD DETAILS
// =========================================
exports.getPlayerDashboard = async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id })
      .populate("user")
      .populate("parents")
      .populate("batch")
      .populate("branch")
      .populate({
        path: "assignedCoach",
        populate: { path: "user" }
      });

    if (!player)
      return res.status(400).json({ message: "Player not found" });

    res.json(player);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================================
// PARENT GET PLAYER DASHBOARD
// =========================================
exports.getParentChildDashboard = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate("user")
      .populate("parents")
      .populate("batch")
      .populate("branch")
      .populate({
        path: "assignedCoach",
        populate: { path: "user" }
      });

    res.json(player);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================================
// GET PLAYER SCHEDULE
// =========================================


// =========================================
// GET PLAYER ASSESSMENTS
// =========================================
exports.getPlayerAssessments = async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });

    const assessments = await Assessment.find({ player: player._id })
      .populate({
        path: "coach",
        populate: { path: "user" }
      })
      .sort({ date: -1 });

    res.json(assessments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================================
// GET PLAYER ATTENDANCE LOG
// =========================================
exports.getPlayerAttendance = async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });

    const logs = await Attendance.find({ player: player._id })
      .sort({ date: -1 });

    res.json(logs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    if (req.user.role !== "player") {
      return res.status(403).json({ message: "Access denied" });
    }

    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const attendance = await Attendance.find({ player: player._id })
      .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMySchedule = async (req, res) => {
  try {
    if (req.user.role !== "player") {
      return res.status(403).json({ message: "Access denied" });
    }

    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const schedule = await Schedule.find({
      player: player._id
    })
      .populate("coach", "user")
      .sort({ createdAt: 1 });

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


