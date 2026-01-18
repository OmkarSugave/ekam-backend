const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

// --------------------
// Initialize app
// --------------------
const app = express();

// --------------------
// Database
// --------------------
connectDB();

// --------------------
// Middleware
// --------------------
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// --------------------
// Static files
// --------------------
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --------------------
// Routes
// --------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/players", require("./routes/players"));
app.use("/api/account", require("./routes/account"));

// --------------------
// Health check
// --------------------
app.get("/", (req, res) => {
  res.send("EKAM TT Backend Running");
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
