const Notification = require("../models/Notification");
const Staff = require("../models/Staff");
const Player = require("../models/Player");

// =============================================
// CREATE NOTIFICATION
// =============================================
exports.createNotification = async (req, res) => {
  try {
    const { title, message, targetType, branch, batch, player } = req.body;

    const notif = await Notification.create({
      title,
      message,
      targetType,
      branch,
      batch,
      player
    });

    res.json({ message: "Notification sent", notification: notif });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// GET NOTIFICATIONS (Filtered by role)
// =============================================
exports.getNotifications = async (req, res) => {
  const user = req.user;

  // ADMIN → sees all
  if (user.role === "admin") {
    const all = await Notification.find().sort({ date: -1 });
    return res.json(all);
  }

  // STAFF (Coach)
  if (user.role === "staff") {
    const staff = await Staff.findOne({ user: user._id });
    const players = await Player.find({ assignedCoach: staff._id });

    const all = await Notification.find({
      $or: [
        { targetType: "all" },
        { targetType: "branch", branch: staff.branch },
        { targetType: "batch", batch: { $in: players.map(p => p.batch) } },
        { targetType: "player", player: { $in: players.map(p => p._id) } }
      ]
    }).sort({ date: -1 });

    return res.json(all);
  }

  // PLAYER or PARENT
  if (user.role === "player" || user.role === "parent") {
    const player = await Player.findOne({ user: user._id });

    if (!player) return res.json([]);

    const all = await Notification.find({
      $or: [
        { targetType: "all" },
        { targetType: "branch", branch: player.branch },
        { targetType: "batch", batch: player.batch },
        { targetType: "player", player: player._id }
      ]
    }).sort({ date: -1 });

    return res.json(all);
  }
};
 
// =============================================
// DELETE NOTIFICATION (Admin only)
// =============================================
exports.deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: "Notification deleted" });
};
