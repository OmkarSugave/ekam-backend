const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Parent = require("./models/Parent");
const Player = require("./models/Player");
const Staff = require("./models/Staff");
const Branch = require("./models/Branch");
const Batch = require("./models/Batch");
const Assessment = require("./models/Assessment");
const Attendance = require("./models/Attendance");
const Schedule = require("./models/Schedule");
const Tournament = require("./models/Tournament");

async function seedDemo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  // Fetch existing
  const branch = await Branch.findOne();
  const batch = await Batch.findOne({ levelIndex: 1 });

  // -----------------------------------------
  // CREATE STAFF (Coach)
  // -----------------------------------------
  const staffUser = await User.create({
    name: "Demo Coach",
    email: "coach@ekam.com",
    passwordHash: bcrypt.hashSync("coach123", 10),
    role: "staff"
  });

  const coach = await Staff.create({
    user: staffUser._id,
    branch: branch._id,
    assignedPlayers: []
  });

  console.log("Coach Created");

  // -----------------------------------------
  // CREATE PARENT
  // -----------------------------------------
  const parentUser = await User.create({
    name: "Parent Demo",
    email: "parent@ekam.com",
    passwordHash: bcrypt.hashSync("parent123", 10),
    role: "parent"
  });

  const parent = await Parent.create({
    user: parentUser._id,
    children: []
  });

  // -----------------------------------------
  // CREATE PLAYER
  // -----------------------------------------
  const playerUser = await User.create({
    name: "Demo Player",
    email: "player@ekam.com",
    passwordHash: bcrypt.hashSync("player123", 10),
    role: "player"
  });

  const skills = Array.from({ length: 10 }).map((_, i) => ({
    skillName: `Skill ${i + 1}`,
    level: 1,
    comment: ""
  }));

  const player = await Player.create({
    user: playerUser._id,
    parents: [parent._id],
    contact: "9999999999",
    dob: new Date("2010-02-15"),
    branch: branch._id,
    batch: batch._id,
    assignedCoach: coach._id,
    skills
  });

  parent.children.push(player._id);
  await parent.save();

  coach.assignedPlayers.push(player._id);
  await coach.save();

  console.log("Demo Player Created");

  // -----------------------------------------
  // CREATE ASSESSMENT
  // -----------------------------------------
  await Assessment.create({
    player: player._id,
    coach: coach._id,
    notes: "Good improvement",
    skillProgress: [
      { skillName: "Skill 1", level: 3, comments: "Improved" },
      { skillName: "Skill 2", level: 2, comments: "Needs work" }
    ]
  });

  console.log("Demo Assessment Created");

  // -----------------------------------------
  // CREATE ATTENDANCE
  // -----------------------------------------
  await Attendance.create({
    player: player._id,
    coach: coach._id,
    date: new Date(),
    status: "Present",
    notes: "On time"
  });

  console.log("Demo Attendance Recorded");

  // -----------------------------------------
  // CREATE SCHEDULE
  // -----------------------------------------
  await Schedule.create({
    player: player._id,
    coach: coach._id,
    day: "Monday",
    time: "5 PM",
    goal: "Backhand drills"
  });

  console.log("Demo Schedule Added");

  // -----------------------------------------
  // CREATE TOURNAMENT
  // -----------------------------------------
  await Tournament.create({
    title: "City Championship",
    date: new Date(),
    venue: "City Arena",
    eligibility: "All"
  });

  console.log("Demo Tournament Created");

  console.log("DEMO SEED COMPLETE");
  process.exit();
}

seedDemo();
