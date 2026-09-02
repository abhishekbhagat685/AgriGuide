const express = require("express");
const router = express.Router();

const Disease = require("../models/Disease");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// =======================
// AI Disease Prediction
// =======================
router.post(

  "/predict",

  // Step 1
  (req, res, next) => {
    console.log("1️⃣ Request received");
    next();
  },

  // Step 2 - Authentication
  auth,

  // Step 3
  (req, res, next) => {
    console.log("2️⃣ Auth passed");
    console.log("req.user =", req.user);
    next();
  },

  // Step 4 - Upload Image
  upload.single("image"),

  // Step 5
  (req, res, next) => {
    console.log("3️⃣ Multer passed");
    console.log("File:", req.file);
    console.log("Body:", req.body);
    next();
  },

  // Step 6 - Controller
  async (req, res) => {

    console.log("4️⃣ Controller started");

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image"
        });
      }

      const { crop } = req.body;

      // Send image to FastAPI AI Server
      const form = new FormData();

      form.append(
        "file",
        fs.createReadStream(req.file.path)
      );

      const aiResponse = await axios.post(
        "http://127.0.0.1:8000/predict",
        form,
        {
          headers: form.getHeaders()
        }
      );

      const prediction = aiResponse.data;

      console.log("AI Prediction:", prediction);

      // Save prediction history
      const history = await Disease.create({

        user: req.user.id,

        image: req.file.path,

        crop: crop,

        disease: prediction.disease,

        confidence: prediction.confidence,

        recommendation: prediction.recommendation

      });

      return res.status(201).json({

        success: true,

        message: "Disease predicted successfully",

        prediction,

        history

      });

    } catch (error) {

      console.error("Prediction Error:", error);

      return res.status(500).json({

        success: false,

        error: error.message

      });

    }

  }

);

// =======================
// Prediction History
// =======================
router.get("/history", auth, async (req, res) => {

  try {

    const history = await Disease.find({

      user: req.user.id

    }).sort({

      createdAt: -1

    });

    return res.status(200).json({

      success: true,

      count: history.length,

      history

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      error: error.message

    });

  }

});

module.exports = router;