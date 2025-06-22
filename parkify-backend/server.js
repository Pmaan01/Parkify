const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import DB connections
require('./db');

// Import routes/models after DB is connected
const authRoutes = require("./routes/auth");
const FreeParking = require("./models/FreeParking");

app.use("/api/auth", authRoutes);

app.get("/api/free-parking", async (req, res) => {
  const spots = await FreeParking.find({});
  res.json(spots);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
