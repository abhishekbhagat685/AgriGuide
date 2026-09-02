const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");
const Crop = require("../models/Crop");
const auth = require("../middleware/authMiddleware");


// =======================
// Add Favorite
// =======================
router.post("/add/:cropId", auth, async (req, res) => {
  try {

    const crop = await Crop.findById(req.params.cropId);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found"
      });
    }

    const exists = await Favorite.findOne({
      user: req.user.id,
      crop: crop._id
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already added to favorites"
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      crop: crop._id
    });

    res.status(201).json({
      success: true,
      message: "Added to favorites",
      data: favorite
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});


// =======================
// Get Favorites
// =======================
router.get("/", auth, async (req, res) => {

  try {

    const favorites = await Favorite.find({
      user: req.user.id
    }).populate("crop");

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// =======================
// Remove Favorite
// =======================
router.delete("/:id", auth, async (req, res) => {

  try {

    const favorite = await Favorite.findById(req.params.id);

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found"
      });
    }

    if (favorite.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await favorite.deleteOne();

    res.status(200).json({
      success: true,
      message: "Favorite removed"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

module.exports = router;