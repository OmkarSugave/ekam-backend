const mongoose = require("mongoose");

const assessmentSkillSchema = new mongoose.Schema({
  skillName: String,
  level: Number,
  comments: String
});

const assessmentSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
  date: { type: Date, default: Date.now },

  notes: String,
  skillProgress: [assessmentSkillSchema]
});

module.exports = mongoose.model("Assessment", assessmentSchema);
