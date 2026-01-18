const Branch = require("../models/Branch");
const Batch = require("../models/Batch");
const Staff = require("../models/Staff");
const User = require("../models/User");
const Player = require("../models/Player");
const Parent = require("../models/Parent");
const Tournament = require("../models/Tournament");
const bcrypt = require("bcryptjs");

// ====================================
// GET ALL BRANCHES
// ====================================
exports.getBranches = async (req, res) => {
  const data = await Branch.find().sort({ name: 1 });
  res.json(data);
};

// ====================================
// ADD BRANCH
// ====================================
exports.addBranch = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name) return res.status(400).json({ message: "Name required" });

    const exists = await Branch.findOne({ name });
    if (exists) return res.status(400).json({ message: "Branch exists" });

    const branch = await Branch.create({ name, address });

    res.json({ message: "Branch added", branch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================
// UPDATE BRANCH
// ====================================
exports.updateBranch = async (req, res) => {
  try {
    const b = await Branch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Branch updated", branch: b });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================
// DELETE BRANCH
// ====================================
exports.deleteBranch = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ message: "Branch deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ====================================
// GET BATCHES
// ====================================
exports.getBatches = async (req, res) => {
  const data = await Batch.find().populate("branch").sort({ levelIndex: 1 });
  res.json(data);
};

// ====================================
// ADD BATCH
// ====================================
exports.addBatch = async (req, res) => {
  try {
    const { name, levelIndex, branchId } = req.body;

    const exists = await Batch.findOne({ name, branch: branchId });
    if (exists)
      return res.status(400).json({ message: "Batch already exists" });

    const batch = await Batch.create({
      name,
      levelIndex,
      branch: branchId
    });

    res.json({ message: "Batch added", batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================
// UPDATE BATCH
// ====================================
exports.updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Batch updated", batch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================
// DELETE BATCH
// ====================================
exports.deleteBatch = async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: "Batch deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ====================================
// LIST STAFF
// ====================================
exports.getStaffList = async (req, res) => {
  const staff = await Staff.find()
    .populate("user")
    .populate("branch");

  res.json(staff);
};

// ====================================
// ADD STAFF
// ====================================
exports.addStaff = async (req, res) => {
  try {
    const { name, email, password, branchId } = req.body;

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email exists" });

    const user = await User.create({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      role: "staff"
    });

    const staff = await Staff.create({
      user: user._id,
      branch: branchId,
      assignedPlayers: []
    });

    res.json({ message: "Staff added", staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================
// UPDATE STAFF
// ====================================
exports.updateStaff = async (req, res) => {
  try {
    const { name, email, branchId } = req.body;

    const staff = await Staff.findById(req.params.id);

    await User.findByIdAndUpdate(staff.user, { name, email });
    staff.branch = branchId;
    await staff.save();

    res.json({ message: "Staff updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================================
// DELETE STAFF
// ====================================
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    await User.findByIdAndDelete(staff.user);
    await Staff.findByIdAndDelete(req.params.id);

    res.json({ message: "Staff deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ====================================
// GET PLAYERS
// ====================================
exports.getPlayerList = async (req, res) => {
  const players = await Player.find()
    .populate("user")
    .populate("parents")
    .populate("branch")
    .populate("batch")
    .populate({
      path: "assignedCoach",
      populate: { path: "user" }
    });

  res.json(players);
};
exports.addPlayer = async (req, res) => {
  try {
    const {
      name, email, password,
      parentName, parentEmail, parentPassword,
      contact, dob,
      branchId, batchId, coachId
    } = req.body;

    // ===============================
    // 1. CREATE PLAYER USER
    // ===============================
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Player email already exists" });
    }

    const playerUser = await User.create({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      role: "player"
    });

    // ===============================
    // 2. FIND OR CREATE PARENT USER
    // ===============================
    let parentUser = await User.findOne({
      email: parentEmail,
      role: "parent"
    });

    if (!parentUser) {
      parentUser = await User.create({
        name: parentName,
        email: parentEmail,
        passwordHash: bcrypt.hashSync(parentPassword, 10),
        role: "parent"
      });
    }

    // ===============================
    // 3. CREATE PLAYER PROFILE
    // ===============================
    const skills = Array.from({ length: 10 }).map((_, i) => ({
      skillName: `Skill ${i + 1}`,
      level: 1,
      comment: ""
    }));

    const player = await Player.create({
      user: playerUser._id,
      parents: [parentUser._id], // ✅ CORRECT (USER ID)
      contact,
      dob,
      branch: branchId,
      batch: batchId,
      assignedCoach: coachId,
      skills
    });

    res.json({
      message: "Player added successfully",
      player
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePlayer = async (req, res) => {
  try {
    const {
      name, email, contact, dob,
      branchId, batchId, coachId
    } = req.body;

    const player = await Player.findById(req.params.id);

    await User.findByIdAndUpdate(player.user, { name, email });

    player.contact = contact;
    player.dob = dob;
    player.branch = branchId;
    player.batch = batchId;
    player.assignedCoach = coachId;

    await player.save();

    res.json({ message: "Player updated", player });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    await User.findByIdAndDelete(player.user);
    await Parent.deleteMany({ _id: { $in: player.parents } });
    await Player.findByIdAndDelete(req.params.id);

    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getTournaments = async (req, res) => {
  const data = await Tournament.find().sort({ date: 1 });
  res.json(data);
};

exports.addTournament = async (req, res) => {
  const t = await Tournament.create(req.body);
  res.json({ message: "Tournament added", tournament: t });
};

exports.updateTournament = async (req, res) => {
  const t = await Tournament.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "Tournament updated", tournament: t });
};

exports.deleteTournament = async (req, res) => {
  await Tournament.findByIdAndDelete(req.params.id);
  res.json({ message: "Tournament deleted" });
};
