const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load .env variables
dotenv.config();

// Import Routes
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5050, () =>
  console.log(`🚀 Server running on port ${process.env.PORT || 5050}`)
);
  })
  .catch((err) => console.error("❌ DB connection error:", err));
