const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Branch = require("./models/Branch");
const Batch = require("./models/Batch");

const bcrypt = require("bcryptjs");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  // CLEAR OLD DATA
  await User.deleteMany({});
  await Branch.deleteMany({});
  await Batch.deleteMany({});

  // -----------------------------------------
  // CREATE ADMIN USER
  // -----------------------------------------
  const admin = await User.create({
    name: "Admin",
    email: "admin@ekam.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin"
  });

  console.log("Admin Created:", admin.email);

  // -----------------------------------------
  // CREATE BRANCHES
  // -----------------------------------------
  const branches = await Branch.insertMany([
    { name: "Main Branch", address: "Central City" },
    { name: "West Branch", address: "West Zone" },
    { name: "East Branch", address: "East Zone" }
  ]);

  console.log("Branches Created");

  // -----------------------------------------
  // CREATE BATCHES
  // -----------------------------------------
  const batches = await Batch.insertMany([
    { name: "Beginner", levelIndex: 1, branch: branches[0]._id },
    { name: "Intermediate", levelIndex: 2, branch: branches[0]._id },
    { name: "Advanced", levelIndex: 3, branch: branches[1]._id }
  ]);

  console.log("Batches Created");
  
  console.log("SEED COMPLETE");
  process.exit();
}

seed();
