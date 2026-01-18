const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"],
    default: "Present"
  },

  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
