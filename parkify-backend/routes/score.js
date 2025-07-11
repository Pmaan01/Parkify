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

//to record each point-earning action
router.post("/add", async (req, res) => {
    const { email, username, score, action } = req.body;

    try {
        const newScore = new Score({ email, username, score, action });
        await newScore.save();
        res.status(201).json({ message: "Score saved successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error saving score" });
    }
});


module.exports = router;
