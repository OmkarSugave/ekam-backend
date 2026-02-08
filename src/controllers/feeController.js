const Player = require("../models/Player");
const Notification = require("../models/Notification");
const User = require("../models/User");

// =============================================
// LIST ALL PLAYER FEES (ADMIN)
// =============================================
exports.getFeePlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate("user")
      .populate("batch")
      .populate("branch");

    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// UPDATE FEE STATUS (ADMIN – MANUAL OVERRIDE)
// =============================================
exports.updateFeeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["UNPAID", "SUBMITTED", "PAID"].includes(status)) {
      return res.status(400).json({ message: "Invalid fee status" });
    }

    const player = await Player.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    player.fees.status = status;

    if (status === "PAID") {
      player.fees.verifiedAt = new Date();
    }

    await player.save();

    res.json({ message: "Fee status updated", fees: player.fees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// DELETE RECEIPT (ADMIN)
// =============================================
exports.deleteFeeReceipt = async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    player.fees.receiptUrl = "";
    player.fees.status = "UNPAID";
    player.fees.submittedAt = null;
    player.fees.verifiedAt = null;

    await player.save();

    res.json({ message: "Receipt removed", fees: player.fees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// VERIFY FEES (ADMIN – SUBMITTED → PAID)
// =============================================
exports.verifyFees = async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId)
      .populate("parents");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    if (player.fees.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Fees not submitted by parent"
      });
    }

    player.fees.status = "PAID";
    player.fees.verifiedAt = new Date();

    await player.save();

    // 🔔 NOTIFY PARENT
    if (player.parents.length > 0) {
      const parentUser = await User.findById(player.parents[0]);
      if (parentUser) {
        await Notification.create({
          user: parentUser._id,
          title: "Fees Verified",
          message: "Your fee payment has been verified by admin.",
          type: "fees"
        });
      }
    }

    res.json({
      message: "Fees verified successfully",
      fees: player.fees
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};