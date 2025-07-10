// confirmedParkingRoutes.js
const express = require('express');
const router = express.Router();
const ConfirmedParking = require('../models/ConfirmedParking');

console.log("✅ confirmedParkingRoutes.js loaded");

// POST route
router.post('/', async (req, res) => {
  try {
    const { userId, spotId, spotName, address, latitude, longitude, duration } = req.body;
    const newRecord = new ConfirmedParking({ userId, spotId, spotName, address, latitude, longitude, duration });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error("❌ POST failed in confirmedParkingRoutes:", err);
    res.status(500).json({ error: 'Failed to save parking confirmation.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in query params." });
    }

    console.log("🔍 Filtering records for userId:", userId);

    const records = await ConfirmedParking.find({ userId: String(userId) }).sort({ confirmedAt: -1 });

    // 🔍 Print each record’s userId
    records.forEach((r, i) => console.log(`Record ${i + 1}: userId =`, r.userId));

    res.status(200).json(records);
  } catch (err) {
    console.error("GET failed in confirmedParkingRoutes:", err);
    res.status(500).json({ error: 'Failed to retrieve history.' });
  }
});



module.exports = router;
