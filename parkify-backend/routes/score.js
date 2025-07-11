const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

//  GET /top - Return top 10 users by total score
router.get("/top", async (req, res) => {
    try {
        const topScores = await Score.aggregate([
            {
                $group: {
                    _id: { email: "$email", username: "$username" },
                    totalScore: { $sum: "$score" }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 10 }
        ]);

        res.json(topScores.map(user => ({
            _id: user._id.email,
            username: user._id.username,
            score: user.totalScore
        })));
    } catch (err) {
        res.status(500).json({ error: "Error fetching top scores" });
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
