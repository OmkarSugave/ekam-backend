const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  targetType: {
    type: String,
    enum: ["all", "branch", "batch", "player"]
  },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", default: null },
  batch:  { type: mongoose.Schema.Types.ObjectId, ref: "Batch", default: null },
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: null },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
