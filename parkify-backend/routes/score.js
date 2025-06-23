const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

router.get("/top", async (req, res) => {
    try {
        const topScores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(topScores);
    } catch (err) {
        res.status(500).json({ error: "Error fetching scores" });
    }
});

module.exports = router;
