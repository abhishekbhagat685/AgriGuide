const express = require("express");
const router = express.Router();

console.log("✅ authRoutes loaded");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// =======================
// Test Route
// =======================

router.get("/test", (req, res) => {
  res.json({
    message: "Auth route is working"
  });
});


// =======================
// Register
// =======================

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create farmer by default
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "farmer"
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


console.log("Login route registered");


// =======================
// Login
// =======================

router.post("/login", async (req, res) => {

  console.log("Login endpoint hit");

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role || "farmer"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "farmer"
      }
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});


module.exports = router;