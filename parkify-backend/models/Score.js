const mongoose = require('mongoose');
const { authConnection } = require('../db');

const ScoreSchema = new mongoose.Schema({
    username: String,   // Chosen display name
    score: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Score = authConnection.model('Score', ScoreSchema);
module.exports = Score;
