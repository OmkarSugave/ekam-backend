const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Player = require("../models/Player");
const Notification = require("../models/Notification");

// =============================================
// UPDATE PROFILE (Name + Email)
// =============================================
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    );

    res.json({ message: "Profile updated", user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =============================================
// CHANGE PASSWORD (Self)
// =============================================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const valid = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!valid)
      return res.status(400).json({ message: "Incorrect current password" });

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =============================================
// RESET PASSWORD (Admin Only)
// =============================================
exports.adminResetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset by admin" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =============================================
// PARENT SUBMIT FEES (Upload Receipt)
// =============================================
exports.submitFees = async (req, res) => {
  try {
    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Access denied" });
    }

    const player = await Player.findOne({ parents: req.user._id }).populate("user");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Receipt is required" });
    }

    player.fees.status = "SUBMITTED";
    player.fees.receiptUrl = req.file.path;
    player.fees.submittedAt = new Date();

    await player.save();

    // 🔔 NOTIFY ADMINS
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        user: admin._id,
        title: "Fee Payment Submitted",
        message: `Fee payment submitted for ${player.user.name}`,
        type: "fees"
      });
    }

    res.json({
      message: "Payment submitted for verification",
      fees: player.fees
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
