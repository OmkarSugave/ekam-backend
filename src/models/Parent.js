const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }]
});

module.exports = mongoose.model("Parent", parentSchema);
