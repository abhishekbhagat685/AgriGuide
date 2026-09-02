const express = require("express");
const router = express.Router();

const CropCalendar = require("../models/CropCalendar");
const Soil = require("../models/Soil");
const Disease = require("../models/Disease");
const User = require("../models/User");
const Crop = require("../models/Crop");
const Fertilizer = require("../models/Fertilizer");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// =====================================
// Test Admin Route
// =====================================

router.get("/test", auth, admin, (req, res) => {

  res.json({
    success: true,
    message: "Admin access granted"
  });

});
// =====================================
// Get All Users
// =====================================

router.get("/users", auth, admin, async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});
// =====================================
// Delete User
// =====================================

router.delete("/users/:id", auth, admin, async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent admin from deleting himself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});
// =====================================
// Change User Role
// =====================================

router.put("/users/:id/role", auth, admin, async (req, res) => {

  try {

    const { role } = req.body;

    // Validate role
    if (!["farmer", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be farmer or admin"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent admin from changing his own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role"
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});
// =====================================
// Get All Crops
// =====================================

router.get("/crops", auth, admin, async (req, res) => {

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

  // =====================================
// Add Crop
// =====================================

router.post("/crops", auth, admin, async (req, res) => {

  try {

    const {
      soilType,
      season,
      crop,
      seed,
      fertilizer
    } = req.body;

    // Validate required fields
    if (!soilType || !season || !crop || !seed || !fertilizer) {
      return res.status(400).json({
        success: false,
        message: "All crop fields are required"
      });
    }

    // Check if crop already exists
    const existingCrop = await Crop.findOne({
      soilType,
      season,
      crop,
      seed
    });

    if (existingCrop) {
      return res.status(400).json({
        success: false,
        message: "Crop already exists"
      });
    }

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
// =====================================
// Update Crop
// =====================================

router.put("/crops/:id", auth, admin, async (req, res) => {

  try {

    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Crop updated successfully",
      data: crop
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});
// =====================================
// Delete Crop
// =====================================

router.delete("/crops/:id", auth, admin, async (req, res) => {

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
// =====================================
// Get All Fertilizers
// =====================================

router.get("/fertilizers", auth, admin, async (req, res) => {

    try {

        const fertilizers = await Fertilizer.find();

        res.status(200).json({
            success: true,
            count: fertilizers.length,
            data: fertilizers
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Add Fertilizer
// =====================================

router.post("/fertilizers", auth, admin, async (req, res) => {

    try {

        const {
            crop,
            soilType,
            nitrogen,
            phosphorus,
            potassium,
            fertilizer,
            quantity
        } = req.body;

        if (
            !crop ||
            !soilType ||
            !nitrogen ||
            !phosphorus ||
            !potassium ||
            !fertilizer ||
            !quantity
        ) {
            return res.status(400).json({
                success: false,
                message: "All fertilizer fields are required"
            });
        }

        const newFertilizer = await Fertilizer.create({
            crop,
            soilType,
            nitrogen,
            phosphorus,
            potassium,
            fertilizer,
            quantity
        });

        res.status(201).json({
            success: true,
            message: "Fertilizer added successfully",
            data: newFertilizer
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Update Fertilizer
// =====================================

router.put("/fertilizers/:id", auth, admin, async (req, res) => {

    try {

        const fertilizer = await Fertilizer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!fertilizer) {
            return res.status(404).json({
                success: false,
                message: "Fertilizer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Fertilizer updated successfully",
            data: fertilizer
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Delete Fertilizer
// =====================================

router.delete("/fertilizers/:id", auth, admin, async (req, res) => {

    try {

        const fertilizer = await Fertilizer.findByIdAndDelete(
            req.params.id
        );

        if (!fertilizer) {
            return res.status(404).json({
                success: false,
                message: "Fertilizer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Fertilizer deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Get All Diseases
// =====================================

router.get("/diseases", auth, admin, async (req, res) => {

    try {

        const diseases = await Disease.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: diseases.length,
            data: diseases
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Add Disease
// =====================================

router.post("/diseases", auth, admin, async (req, res) => {

    try {

        const {
            image,
            crop,
            disease,
            confidence,
            recommendation
        } = req.body;

        // Validate required fields
        if (
            !image ||
            !crop ||
            !disease ||
            confidence === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Image, crop, disease and confidence are required"
            });
        }

        const newDisease = await Disease.create({

            user: req.user.id,

            image: image,

            crop: crop,

            disease: disease,

            confidence: confidence,

            recommendation:
                recommendation ||
                "Consult a local agricultural expert."

        });

        res.status(201).json({

            success: true,

            message: "Disease record added successfully",

            data: newDisease

        });

    } catch (error) {

        console.error("Add Disease Error:", error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});
// =====================================
// Update Disease
// =====================================

router.put("/diseases/:id", auth, admin, async (req, res) => {

    try {

        const {
            image,
            crop,
            disease,
            confidence,
            recommendation
        } = req.body;

        const updatedDisease = await Disease.findByIdAndUpdate(
            req.params.id,
            {
                image,
                crop,
                disease,
                confidence,
                recommendation
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDisease) {
            return res.status(404).json({
                success: false,
                message: "Disease record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Disease record updated successfully",
            data: updatedDisease
        });

    } catch (error) {

        console.error("Update Disease Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// Delete Disease
// =====================================

router.delete("/diseases/:id", auth, admin, async (req, res) => {

    try {

        const deletedDisease = await Disease.findByIdAndDelete(
            req.params.id
        );

        if (!deletedDisease) {
            return res.status(404).json({
                success: false,
                message: "Disease record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Disease record deleted successfully",
            data: deletedDisease
        });

    } catch (error) {

        console.error("Delete Disease Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Get All Soil Analyses
// =====================================

router.get("/soils", auth, admin, async (req, res) => {

    try {

        const soils = await Soil.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: soils.length,
            data: soils
        });

    } catch (error) {

        console.error("Get Soil Analyses Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Get Soil Analysis By ID
// =====================================

router.get("/soils/:id", auth, admin, async (req, res) => {

    try {

        const soil = await Soil.findById(req.params.id)
            .populate("user", "name email");

        if (!soil) {
            return res.status(404).json({
                success: false,
                message: "Soil analysis not found"
            });
        }

        res.status(200).json({
            success: true,
            data: soil
        });

    } catch (error) {

        console.error("Get Soil Analysis Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Update Soil Analysis
// =====================================

router.put("/soils/:id", auth, admin, async (req, res) => {

    try {

        const {
            soilType,
            nitrogen,
            phosphorus,
            potassium,
            ph,
            moisture,
            recommendation
        } = req.body;

        const updatedSoil = await Soil.findByIdAndUpdate(

            req.params.id,

            {
                soilType,
                nitrogen,
                phosphorus,
                potassium,
                ph,
                moisture,
                recommendation
            },

            {
                new: true,
                runValidators: true
            }

        );

        if (!updatedSoil) {
            return res.status(404).json({
                success: false,
                message: "Soil analysis not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Soil analysis updated successfully",
            data: updatedSoil
        });

    } catch (error) {

        console.error("Update Soil Analysis Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Delete Soil Analysis
// =====================================

router.delete("/soils/:id", auth, admin, async (req, res) => {

    try {

        const soil = await Soil.findByIdAndDelete(req.params.id);

        if (!soil) {
            return res.status(404).json({
                success: false,
                message: "Soil analysis not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Soil analysis deleted successfully"
        });

    } catch (error) {

        console.error("Delete Soil Analysis Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Add Crop Calendar Record
// =====================================

router.post("/calendars", auth, admin, async (req, res) => {

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

        // Validate required fields
        if (
            !crop ||
            !season ||
            !sowingMonths ||
            !harvestMonths ||
            !duration ||
            !irrigation ||
            !temperature ||
            !rainfall
        ) {
            return res.status(400).json({
                success: false,
                message: "All calendar fields are required"
            });
        }

        // Check if crop already exists
        const existingCalendar = await CropCalendar.findOne({
            crop
        });

        if (existingCalendar) {
            return res.status(400).json({
                success: false,
                message: "Calendar for this crop already exists"
            });
        }

        // Create calendar record
        const newCalendar = await CropCalendar.create({
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
            data: newCalendar
        });

    } catch (error) {

        console.error("Add Crop Calendar Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Get All Crop Calendar Records
// =====================================

router.get("/calendars", auth, admin, async (req, res) => {

    try {

        const calendars = await CropCalendar.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: calendars.length,
            data: calendars
        });

    } catch (error) {

        console.error("Get Calendar Records Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Get Crop Calendar By ID
// =====================================

router.get("/calendars/:id", auth, admin, async (req, res) => {

    try {

        const calendar = await CropCalendar.findById(req.params.id);

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

        console.error("Get Calendar By ID Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Update Crop Calendar Record
// =====================================

router.put("/calendars/:id", auth, admin, async (req, res) => {

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

        const updatedCalendar = await CropCalendar.findByIdAndUpdate(

            req.params.id,

            {
                crop,
                season,
                sowingMonths,
                harvestMonths,
                duration,
                irrigation,
                temperature,
                rainfall
            },

            {
                new: true,
                runValidators: true
            }

        );

        if (!updatedCalendar) {
            return res.status(404).json({
                success: false,
                message: "Crop calendar not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Crop calendar updated successfully",
            data: updatedCalendar
        });

    } catch (error) {

        console.error("Update Crop Calendar Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});
// =====================================
// Delete Crop Calendar Record
// =====================================

router.delete("/calendars/:id", auth, admin, async (req, res) => {

    try {

        const calendar = await CropCalendar.findByIdAndDelete(
            req.params.id
        );

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

        console.error("Delete Crop Calendar Error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});



module.exports = router;