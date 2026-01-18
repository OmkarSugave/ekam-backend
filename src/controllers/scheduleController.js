const Schedule = require("../models/Schedule");
const Player = require("../models/Player");
const Staff = require("../models/Staff");

// ================================
// GET PLAYER SCHEDULE (Admin/Coach/Player)
// ================================
exports.getPlayerSchedule = async (req, res) => {
  const { playerId } = req.params;

  const schedule = await Schedule.find({ player: playerId })
    .populate("coach", "user")
    .sort({ day: 1 });

  res.json(schedule);
};

// ================================
// ADD SCHEDULE
// ================================
exports.addSchedule = async (req, res) => {
  try {
    const { playerId, day, time, goal } = req.body;

    const coach = await Staff.findOne({ user: req.user._id });
    const player = await Player.findById(playerId);

    if (!player)
      return res.status(404).json({ message: "Player not found" });

    // Permission check
    if (
      req.user.role !== "admin" &&
      String(player.assignedCoach) !== String(coach._id)
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const entry = await Schedule.create({
      player: playerId,
      coach: coach ? coach._id : null,
      day,
      time,
      goal
    });

    res.json({ message: "Schedule added", entry });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// UPDATE SCHEDULE
// ================================
exports.updateSchedule = async (req, res) => {
  try {
    const entry = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Schedule updated", entry });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// DELETE SCHEDULE
// ================================
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
