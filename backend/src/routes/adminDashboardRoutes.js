const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Crop = require("../models/Crop");
const Fertilizer = require("../models/Fertilizer");
const Disease = require("../models/Disease");
const Soil = require("../models/Soil");
const Favorite = require("../models/Favorite");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/", auth, admin, async (req, res) => {

    console.log("✅ Dashboard route reached");

    try {

        console.log("⏳ Counting users...");

        const totalUsers = await User.countDocuments();
        console.log("Users:", totalUsers);

        const totalFarmers = await User.countDocuments({
            role: "farmer"
        });
        console.log("Farmers:", totalFarmers);

        const totalAdmins = await User.countDocuments({
            role: "admin"
        });
        console.log("Admins:", totalAdmins);

        const totalCrops = await Crop.countDocuments();
        console.log("Crops:", totalCrops);

        const totalFertilizers = await Fertilizer.countDocuments();
        console.log("Fertilizers:", totalFertilizers);

        const totalDiseases = await Disease.countDocuments();
        console.log("Diseases:", totalDiseases);

        const totalSoilAnalyses = await Soil.countDocuments();
        console.log("Soil:", totalSoilAnalyses);

        const totalFavorites = await Favorite.countDocuments();
        console.log("Favorites:", totalFavorites);

        console.log("✅ All counts completed");

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalFarmers,
                totalAdmins,
                totalCrops,
                totalFertilizers,
                totalDiseases,
                totalSoilAnalyses,
                totalFavorites
            }
        });

    } catch (error) {

        console.error("❌ Dashboard Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }
});
// =====================================
// Recent Activity
// =====================================

router.get("/recent", auth, admin, async (req, res) => {

    try {

        const recentUsers = await User.find()
            .select("-password")
            .sort({ createdAt: -1 })
            .limit(5);

        const recentCrops = await Crop.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const recentSoilAnalyses = await Soil.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const recentDiseases = await Disease.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({

            success: true,

            data: {

                recentUsers,

                recentCrops,

                recentSoilAnalyses,

                recentDiseases

            }

        });

    } catch (error) {

        console.error("Recent Activity Error:", error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

module.exports = router;