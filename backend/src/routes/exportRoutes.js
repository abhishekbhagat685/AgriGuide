
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Crop = require("../models/Crop");
const Fertilizer = require("../models/Fertilizer");
const Disease = require("../models/Disease");
const Soil = require("../models/Soil");
const CropCalendar = require("../models/CropCalendar");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// =====================================
// Export Users Data
// =====================================

router.get("/users", auth, admin, async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .lean();

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================
// Export Crops Data
// =====================================

router.get("/crops", auth, admin, async (req, res) => {
    try {
        const crops = await Crop.find().lean();

        res.status(200).json(crops);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================
// Export Fertilizers Data
// =====================================

router.get("/fertilizers", auth, admin, async (req, res) => {
    try {
        const fertilizers = await Fertilizer.find().lean();

        res.status(200).json(fertilizers);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================
// Export Diseases Data
// =====================================

router.get("/diseases", auth, admin, async (req, res) => {
    try {
        const diseases = await Disease.find().lean();

        res.status(200).json(diseases);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================
// Export Soil Analysis Data
// =====================================

router.get("/soils", auth, admin, async (req, res) => {
    try {
        const soils = await Soil.find().lean();

        res.status(200).json(soils);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================
// Export Crop Calendar Data
// =====================================

router.get("/crop-calendars", auth, admin, async (req, res) => {
    try {
        const cropCalendars = await CropCalendar.find().lean();

        res.status(200).json(cropCalendars);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;
