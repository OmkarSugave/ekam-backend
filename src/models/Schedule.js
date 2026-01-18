const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  day: String,
  time: String,
  goal: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Schedule", scheduleSchema);
