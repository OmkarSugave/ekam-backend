const mongoose = require("mongoose");
const Attendance = require("./Attendance");

const skillSchema = new mongoose.Schema({
  skillName: String,
  level: { type: Number, default: 1 },
  comment: { type: String, default: "" }
});

const playerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Parent" }],

  contact: String,
  dob: Date,

  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },

  assignedCoach: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

  // ✅ SINGLE SOURCE OF TRUTH FOR FEES
  fees: {
    status: {
      type: String,
      enum: ["UNPAID", "SUBMITTED", "PAID"],
      default: "UNPAID"
    },
    receiptUrl: { type: String, default: "" },
    submittedAt: Date,
    verifiedAt: Date
  },

  skills: [skillSchema] // Array of 10 skills
});

module.exports = mongoose.model("Player", playerSchema);
