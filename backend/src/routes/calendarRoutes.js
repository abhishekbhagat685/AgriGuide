const express = require("express");
const router = express.Router();

const CropCalendar = require("../models/CropCalendar");
const auth = require("../middleware/authMiddleware");

// =======================
// Add Crop Calendar
// =======================
router.post("/add", auth, async (req, res) => {
  try {
    const {
      crop,
      season,
      sowingMonths,
      harvestMonths,
      duration,
      irrigation,
      temperature,
      rainfall
    } = req.body;

    // Check if crop already exists
    const exists = await CropCalendar.findOne({ crop });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Crop calendar already exists"
      });
    }

    const calendar = await CropCalendar.create({
      crop,
      season,
      sowingMonths,
      harvestMonths,
      duration,
      irrigation,
      temperature,
      rainfall
    });

    res.status(201).json({
      success: true,
      message: "Crop calendar added successfully",
      data: calendar
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});

// =======================
// Get All Crop Calendars
// =======================
router.get("/", auth, async (req, res) => {
  try {

    const calendars = await CropCalendar.find();

    res.status(200).json({
      success: true,
      count: calendars.length,
      data: calendars
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});
// =======================
// Get Calendar By Crop Name
// =======================
router.get("/:crop", auth, async (req, res) => {

  try {

    const calendar = await CropCalendar.findOne({
      crop: req.params.crop
    });

    if (!calendar) {
      return res.status(404).json({
        success: false,
        message: "Crop calendar not found"
      });
    }

    res.status(200).json({
      success: true,
      data: calendar
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});
// =======================
// Update Crop Calendar
// =======================
router.put("/:id", auth, async (req, res) => {

  try {

    const calendar = await CropCalendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!calendar) {

      return res.status(404).json({
        success: false,
        message: "Crop calendar not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Crop calendar updated successfully",
      data: calendar
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});
// =======================
// Delete Crop Calendar
// =======================
router.delete("/:id", auth, async (req, res) => {

  try {

    const calendar = await CropCalendar.findByIdAndDelete(req.params.id);

    if (!calendar) {

      return res.status(404).json({
        success: false,
        message: "Crop calendar not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Crop calendar deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

module.exports = router;