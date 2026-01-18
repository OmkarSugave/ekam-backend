const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  assignedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }]
});

module.exports = mongoose.model("Staff", staffSchema);
