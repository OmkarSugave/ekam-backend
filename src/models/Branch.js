const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String
});

module.exports = mongoose.model("Branch", branchSchema);
