const Attendance = require("../models/Attendance");
const Player = require("../models/Player");
const Staff = require("../models/Staff");

// =============================================
// MARK ATTENDANCE
// =============================================
exports.markAttendance = async (req, res) => {
  try {
    const { playerId, date, status, notes } = req.body;

    const coach = await Staff.findOne({ user: req.user._id });
    const player = await Player.findById(playerId);

    if (!player) return res.status(404).json({ message: "Player not found" });

    // Permission: Coach can only mark for assigned players
    if (
      req.user.role !== "admin" &&
      String(player.assignedCoach) !== String(coach._id)
    ) {
      return res.status(403).json({ message: "Not your assigned player" });
    }

    const attendance = await Attendance.create({
      player: playerId,
      coach: coach ? coach._id : null,
      date,
      status,
      notes
    });

    res.json({ message: "Attendance marked", attendance });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =============================================
// UPDATE ATTENDANCE
// =============================================
exports.updateAttendance = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    );

    res.json({ message: "Attendance updated", updated });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =============================================
// DELETE ATTENDANCE
// =============================================
exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: "Attendance deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =============================================
// LIST ATTENDANCE (FILTER SUPPORTED)
// =============================================
exports.getAttendance = async (req, res) => {
  const { playerId, date } = req.query;
  const user = req.user;

  let filter = {};
  if (playerId) filter.player = playerId;
  if (date) filter.date = new Date(date);

  // Staff sees only their assigned players
  if (user.role === "staff") {
    const coach = await Staff.findOne({ user: user._id });
    filter.coach = coach._id;
  }

  const logs = await Attendance.find(filter)
    .populate("player", "user")
    .populate({ path: "coach", populate: { path: "user" } })
    .sort({ date: -1 });

  res.json(logs);
};
