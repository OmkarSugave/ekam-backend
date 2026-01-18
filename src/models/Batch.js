const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  levelIndex: { type: Number, required: true },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }
});

module.exports = mongoose.model("Batch", batchSchema);
