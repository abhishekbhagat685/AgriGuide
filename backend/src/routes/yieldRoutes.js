const express = require("express");
const axios = require("axios");

const router = express.Router();

// URL of your Python FastAPI yield prediction service
const YIELD_API_URL = process.env.YIELD_API_URL || "http://localhost:8000";

/**
 * POST /api/yield/predict
 * Proxies crop yield prediction requests to the Python FastAPI service
 */
router.post("/predict", async (req, res) => {
  const { item, rainfall, pesticides, temperature } = req.body;

  // Basic validation before forwarding
  if (!item || rainfall === undefined || pesticides === undefined || temperature === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: item, rainfall, pesticides, temperature"
    });
  }

  try {
    const response = await axios.post(`${YIELD_API_URL}/predict`, {
      item,
      rainfall,
      pesticides,
      temperature
    });

    return res.status(200).json(response.data);
  } catch (error) {
    // Forward the Python API's error message if available (e.g. unknown crop -> 400)
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: error.response.data.detail || "Prediction service error"
      });
    }

    // Python service unreachable (not running, wrong port, etc.)
    console.error("Yield prediction service error:", error.message);
    return res.status(503).json({
      success: false,
      message: "Yield prediction service is unavailable. Please try again later."
    });
  }
});

module.exports = router;