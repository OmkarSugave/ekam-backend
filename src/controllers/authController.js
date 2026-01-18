const User = require("../models/User");
const Staff = require("../models/Staff");
const Parent = require("../models/Parent");
const Player = require("../models/Player");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================================
// LOGIN
// ================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = bcrypt.compareSync(password, user.passwordHash);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// GET LOGGED-IN USER PROFILE
// ================================
exports.getProfile = async (req, res) => {
  res.json(req.user);
};
