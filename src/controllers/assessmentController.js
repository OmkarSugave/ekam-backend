const Assessment = require("../models/Assessment");
const Player = require("../models/Player");
const Staff = require("../models/Staff");

// =============================================
// GET ALL ASSESSMENTS FOR A PLAYER
// =============================================
exports.getPlayerAssessments = async (req, res) => {
  const { playerId } = req.params;

  const assessments = await Assessment.find({ player: playerId })
    .populate({
      path: "coach",
      populate: { path: "user" }
    })
    .sort({ date: -1 });

  res.json(assessments);
};

// =============================================
// ADD ASSESSMENT
// =============================================
exports.addAssessment = async (req, res) => {
  try {
    const { playerId, notes, skillProgress } = req.body;

    const coach = await Staff.findOne({ user: req.user._id });

    const assessment = await Assessment.create({
      player: playerId,
      coach: coach._id,
      notes,
      skillProgress
    });

    // Update player main skillset
    const player = await Player.findById(playerId);
    skillProgress.forEach((s) => {
      let skill = player.skills.find((x) => x.skillName === s.skillName);
      if (skill) {
        skill.level = s.level;
        skill.comment = s.comments;
      }
    });
    await player.save();

    res.json({ message: "Assessment added", assessment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// UPDATE ASSESSMENT
// =============================================
exports.updateAssessment = async (req, res) => {
  try {
    const { notes, skillProgress } = req.body;

    const updated = await Assessment.findByIdAndUpdate(
      req.params.id,
      { notes, skillProgress },
      { new: true }
    );

    // Update player skillset also
    const player = await Player.findById(updated.player);
    skillProgress.forEach((s) => {
      let skill = player.skills.find((x) => x.skillName === s.skillName);
      if (skill) {
        skill.level = s.level;
        skill.comment = s.comments;
      }
    });
    await player.save();

    res.json({ message: "Assessment updated", updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================
// DELETE ASSESSMENT
// =============================================
exports.deleteAssessment = async (req, res) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assessment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
