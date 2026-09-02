const express = require("express");
const router = express.Router();

const Crop = require("../models/Crop");
const Recommendation = require("../models/Recommendation");
const auth = require("../middleware/authMiddleware");


// ======================
// Get Crop Recommendation
// ======================
router.post("/recommend", auth, async (req, res) => {
  try {
    const { soilType, season } = req.body;

    const crop = await Crop.findOne({
  soilType,
  season
});

console.log("========== CROP FOUND ==========");
console.log(crop);
console.log("================================");

    if (!crop) {
      return res.status(404).json({
        message: "No crop recommendation found"
      });
    }
    console.log({
  user: req.user.id,
  soilType,
  season,
  recommendedCrop: crop.crop,
  seed: crop.seed,
  fertilizer: crop.fertilizer
});

    // Save recommendation history
    await Recommendation.create({
  user: req.user.id,
  soilType,
  season,
  recommendedCrop: crop.crop,
  seed: crop.seed,
  fertilizer: crop.fertilizer
});

    res.status(200).json({
      success: true,
      data: {
        soilType,
        season,
        recommendedCrop: crop.crop,
        recommendedSeed: crop.seed,
        recommendedFertilizer: crop.fertilizer
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


// ======================
// Recommendation History
// ======================
router.get("/history", auth, async (req, res) => {

  try {

    const history = await Recommendation
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ======================
// Get All Crops
// ======================
router.get("/allcrops", async (req, res) => {

  try {

    const crops = await Crop.find();

    res.status(200).json({
      success: true,
      count: crops.length,
      data: crops
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ======================
// Add Sample Crop
// ======================
router.get("/addsample", async (req, res) => {

  try {

    const crop = await Crop.create({
      soilType: "Black",
      season: "Kharif",
      crop: "Cotton",
      seed: "BT Cotton",
      fertilizer: "NPK"
    });

    res.status(201).json({
      success: true,
      data: crop
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ======================
// Add New Crop
// ======================
router.post("/addcrop", async (req, res) => {

  try {

    const {
      soilType,
      season,
      crop,
      seed,
      fertilizer
    } = req.body;

    const newCrop = await Crop.create({
      soilType,
      season,
      crop,
      seed,
      fertilizer
    });

    res.status(201).json({
      success: true,
      message: "Crop added successfully",
      data: newCrop
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ======================
// Update Crop
// ======================
router.put("/updatecrop/:id", async (req, res) => {

  try {

    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedCrop) {

      return res.status(404).json({
        success: false,
        message: "Crop not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      data: updatedCrop
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ======================
// Delete Crop
// ======================
router.delete("/deletecrop/:id", async (req, res) => {

  try {

    const crop = await Crop.findByIdAndDelete(req.params.id);

    if (!crop) {

      return res.status(404).json({
        success: false,
        message: "Crop not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Crop deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

module.exports = router;