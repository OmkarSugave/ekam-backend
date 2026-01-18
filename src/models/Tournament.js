const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  title: String,
  date: Date,
  venue: String,
  eligibility: String
});

module.exports = mongoose.model("Tournament", tournamentSchema);
