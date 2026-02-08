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
// CORS CONFIG (VERY IMPORTANT)
// --------------------
const allowedOrigins = [
  "http://localhost:5173",
  "https://ekam-frontend-kappa.vercel.app" // ✅ your Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / server calls
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// --------------------
// Middleware
// --------------------
app.use(express.json());

// --------------------
// Static files (Fee receipts, uploads)
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