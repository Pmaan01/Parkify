const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Import models and routes
const FreeParking = require("./models/FreeParking");
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);
console.log("scoreRoutes =", scoreRoutes);
console.log("typeof scoreRoutes =", typeof scoreRoutes);


// ✅ GET all parking spots
app.get("/api/free-parking", async (req, res) => {
  try {
    const spots = await FreeParking.find({});
    res.json(spots);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT to update hasSpots and availableSpots
app.put("/api/free-parking/:id", async (req, res) => {
  try {
    const updated = await FreeParking.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          hasSpots: req.body.hasSpots,
          availableSpots: req.body.availableSpots,
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Spot not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    res.status(500).json({ error: "Failed to update parking spot" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
