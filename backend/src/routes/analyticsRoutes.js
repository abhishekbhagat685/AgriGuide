
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
// Analytics Dashboard Summary
// =====================================

router.get("/summary", auth, admin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalFarmers,
            totalAdmins,
            totalCrops,
            totalFertilizers,
            totalDiseases,
            totalSoilAnalyses,
            totalCalendars
        ] = await Promise.all([
            User.countDocuments(),

            User.countDocuments({
                role: "farmer"
            }),

            User.countDocuments({
                role: "admin"
            }),

            Crop.countDocuments(),

            Fertilizer.countDocuments(),

            Disease.countDocuments(),

            Soil.countDocuments(),

            CropCalendar.countDocuments()
        ]);

        res.status(200).json({
            success: true,

            data: {
                users: {
                    total: totalUsers,
                    farmers: totalFarmers,
                    admins: totalAdmins
                },

                crops: totalCrops,

                fertilizers: totalFertilizers,

                diseases: totalDiseases,

                soilAnalyses: totalSoilAnalyses,

                cropCalendars: totalCalendars
            }
        });

    } catch (error) {
        console.error("Analytics Summary Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================
// User Growth Analytics
// =====================================

router.get("/user-growth", auth, admin, async (req, res) => {
    try {
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $ne: null
                    }
                }
            },

            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },

                        month: {
                            $month: "$createdAt"
                        },

                        day: {
                            $dayOfMonth: "$createdAt"
                        }
                    },

                    totalUsers: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                    "_id.day": 1
                }
            },

            {
                $project: {
                    _id: 0,

                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: "$_id.day"
                        }
                    },

                    totalUsers: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: userGrowth.length,
            data: userGrowth
        });

    } catch (error) {
        console.error("User Growth Analytics Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =====================================
// Crop Analytics By Season
// =====================================

router.get("/crop-analytics", auth, admin, async (req, res) => {
    try {
        const cropAnalytics = await Crop.aggregate([
            {
                $group: {
                    _id: "$season",

                    totalCrops: {
                        $sum: 1
                    }
                }
            },

            {
                $sort: {
                    totalCrops: -1
                }
            },

            {
                $project: {
                    _id: 0,
                    season: "$_id",
                    totalCrops: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: cropAnalytics.length,
            data: cropAnalytics
        });

    } catch (error) {
        console.error("Crop Analytics Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =====================================
// Disease Analytics
// =====================================

router.get("/disease-analytics", auth, admin, async (req, res) => {

    try {

        const diseaseAnalytics = await Disease.aggregate([

            // Group disease records by disease name
            {
                $group: {
                    _id: "$disease",

                    totalCases: {
                        $sum: 1
                    }
                }
            },

            // Sort by highest number of cases
            {
                $sort: {
                    totalCases: -1
                }
            },

            // Format the response
            {
                $project: {
                    _id: 0,
                    disease: "$_id",
                    totalCases: 1
                }
            }

        ]);

        res.status(200).json({
            success: true,
            count: diseaseAnalytics.length,
            data: diseaseAnalytics
        });

    } catch (error) {

        console.error("Disease Analytics Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// =====================================
// Soil Analytics
// =====================================

router.get("/soil-analytics", auth, admin, async (req, res) => {

    try {

        const soilAnalytics = await Soil.aggregate([

            // Group soil analysis records by soil type
            {
                $group: {
                    _id: "$soilType",

                    totalAnalyses: {
                        $sum: 1
                    }
                }
            },

            // Sort by highest number of analyses
            {
                $sort: {
                    totalAnalyses: -1
                }
            },

            // Format the response
            {
                $project: {
                    _id: 0,
                    soilType: "$_id",
                    totalAnalyses: 1
                }
            }

        ]);

        res.status(200).json({
            success: true,
            count: soilAnalytics.length,
            data: soilAnalytics
        });

    } catch (error) {

        console.error("Soil Analytics Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// =====================================
// Fertilizer Analytics
// =====================================

router.get("/fertilizer-analytics", auth, admin, async (req, res) => {

    try {

        const fertilizerAnalytics = await Fertilizer.aggregate([

            // Group records by fertilizer name
            {
                $group: {
                    _id: "$fertilizer",

                    totalRecommendations: {
                        $sum: 1
                    }
                }
            },

            // Sort by highest count
            {
                $sort: {
                    totalRecommendations: -1
                }
            },

            // Format response
            {
                $project: {
                    _id: 0,
                    fertilizer: "$_id",
                    totalRecommendations: 1
                }
            }

        ]);

        res.status(200).json({
            success: true,
            count: fertilizerAnalytics.length,
            data: fertilizerAnalytics
        });

    } catch (error) {

        console.error("Fertilizer Analytics Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// =====================================
// Crop Calendar Analytics
// =====================================

router.get("/calendar-analytics", auth, admin, async (req, res) => {

    try {

        const calendarAnalytics = await CropCalendar.aggregate([

            // Group crop calendars by season
            {
                $group: {
                    _id: "$season",

                    totalCrops: {
                        $sum: 1
                    }
                }
            },

            // Sort by highest number of crops
            {
                $sort: {
                    totalCrops: -1
                }
            },

            // Format response
            {
                $project: {
                    _id: 0,
                    season: "$_id",
                    totalCrops: 1
                }
            }

        ]);

        res.status(200).json({
            success: true,
            count: calendarAnalytics.length,
            data: calendarAnalytics
        });

    } catch (error) {

        console.error("Crop Calendar Analytics Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});

// =====================================
// Analytics Overview for Power BI
// =====================================

router.get("/overview", auth, admin, async (req, res) => {

    try {

        const [
            users,
            crops,
            fertilizers,
            diseases,
            soils,
            calendars
        ] = await Promise.all([

            User.find()
                .select("-password")
                .lean(),

            Crop.find().lean(),

            Fertilizer.find().lean(),

            Disease.find().lean(),

            Soil.find().lean(),

            CropCalendar.find().lean()

        ]);

        res.status(200).json({
            success: true,

            data: {
                users,
                crops,
                fertilizers,
                diseases,
                soils,
                cropCalendars: calendars
            }
        });

    } catch (error) {

        console.error("Analytics Overview Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});








module.exports = router;

