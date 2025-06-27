const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to DB
require('./db');

// ✅ Import models and routes
const FreeParking = require("./models/FreeParking");
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);
console.log("scoreRoutes =", scoreRoutes);
console.log("typeof scoreRoutes =", typeof scoreRoutes);


// ✅ Free parking route
app.get("/api/free-parking", async (req, res) => {
  try {
    const spots = await FreeParking.find({});
    res.json(spots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch parking spots." });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
