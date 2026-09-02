const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {

    const authHeader = req.header("Authorization");

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "Access Denied"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "Token Missing"
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    // Find user in MongoDB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Put user information into req.user
    req.user = {
      id: user._id.toString(),
      role: user.role
    };

    console.log("Authenticated User:", req.user);

    next();

  } catch (err) {

    console.log("JWT Error:", err.message);

    return res.status(401).json({
      message: "Invalid Token"
    });

  }
};

module.exports = auth;