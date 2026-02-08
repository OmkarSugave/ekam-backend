const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// --------------------
// DATABASE
// --------------------
connectDB();

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ekam-frontend-kappa.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// --------------------
// STATIC FILES
// --------------------
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --------------------
// ROUTES
// --------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/players", require("./routes/players"));
app.use("/api/account", require("./routes/account"));

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.send("EKAM TT Backend Running");
});

// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});