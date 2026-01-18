const Staff = require("../models/Staff");
const Player = require("../models/Player");

// =========================================
// GET ASSIGNED PLAYERS FOR COACH
// =========================================
exports.getAssignedPlayers = async (req, res) => {
  try {
    const coach = await Staff.findOne({ user: req.user._id });

    if (!coach)
      return res.status(400).json({ message: "Not a valid staff user" });

    const players = await Player.find({ assignedCoach: coach._id })
      .populate("user")
      .populate("batch")
      .populate("branch");

    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================================
// GET PLAYER DETAILS (Coach restricted)
// =========================================
exports.getPlayerDetailsByCoach = async (req, res) => {
  try {
    const coach = await Staff.findOne({ user: req.user._id });
    const { id } = req.params;

    const player = await Player.findById(id)
      .populate("user")
      .populate("parents")
      .populate("batch")
      .populate("branch")
      .populate({
        path: "assignedCoach",
        populate: { path: "user" }
      });

    if (!player)
      return res.status(404).json({ message: "Player not found" });

    // Permission check
    if (String(player.assignedCoach._id) !== String(coach._id))
      return res.status(403).json({ message: "Not your assigned player" });

    res.json(player);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
