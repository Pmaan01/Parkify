const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @route   POST /api/auth/signup
 * @desc    Create a new user account
 * @access  Public
 */
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    console.log("📨 Signup request body:", req.body);

    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save user to the database
        const savedUser = await newUser.save();
        console.log("✅ User created:", savedUser);

        // Return response (excluding password)
        res.status(201).json({
            message: "User created successfully",
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                createdAt: savedUser.createdAt
            }
        });

    } catch (err) {
        // Handle database/server errors
        console.error("❌ Error saving user:", err);
        res.status(500).json({
            error: "Signup failed",
            message: err.message,
            stack: err.stack
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check for required fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Missing email or password"
        });
    }

    try {
        // Find user by email
        const foundUser = await User.findOne({ email });

        // If user not found
        if (!foundUser) {
            return res.status(404).json({
                message: "User doesn't exist"
            });
        }

        // Compare password with hashed password
        const matchPassword = await bcrypt.compare(password, foundUser.password);
        console.log("👉 Input password:", password);
        console.log("👉 Hashed in DB:", foundUser.password);

        if (!matchPassword) {
            return res.status(401).json({
                message: "User credentials incorrect"
            });
        }

        // Generate JWT token with 1-hour expiry
        const accessToken = jwt.sign(
            {
                name: foundUser.name,
                email: foundUser.email
            },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Return token and user info
        return res.status(200).json({
            token: accessToken,
            data: {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email
            },
            message: "User successfully logged in."
        });

    } catch (err) {
        // Handle login errors
        return res.status(500).json({
            message: "Login error",
            error: err.message
        });
    }
});

module.exports = router;
