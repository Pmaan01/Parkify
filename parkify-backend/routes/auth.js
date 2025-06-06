const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    console.log("📨 Signup request body:", req.body);

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const user = new User({ name, email, password });
        await user.save();
        console.log("✅ User created:", user);
        res.status(201).json({ message: "User created" });
    } catch (err) {
        console.error("❌ Error saving user:", err.message);
        res.status(400).json({ error: "Signup failed", details: err.message });
    }
});


// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("📨 Signup/Login request received");

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ error: "Login error" });
    }
});

module.exports = router;
