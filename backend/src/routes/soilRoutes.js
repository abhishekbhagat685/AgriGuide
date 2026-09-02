const express = require("express");

const router = express.Router();

const Soil = require("../models/Soil");
const auth = require("../middleware/authMiddleware");


// ===========================
// Add Soil Analysis
// ===========================

router.post("/add", auth, async (req, res) => {

  try {

    const {
      soilType,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      moisture
    } = req.body;


    // Basic soil recommendation logic

    let recommendation = "";


    if (ph < 5.5) {

      recommendation = "Soil is acidic. Apply lime to improve soil pH.";

    }
    else if (ph > 7.5) {

      recommendation = "Soil is alkaline. Consider adding organic matter and suitable soil amendments.";

    }
    else if (nitrogen < 40) {

      recommendation = "Nitrogen level is low. Apply nitrogen-rich fertilizer.";

    }
    else if (phosphorus < 30) {

      recommendation = "Phosphorus level is low. Apply phosphorus-rich fertilizer.";

    }
    else if (potassium < 40) {

      recommendation = "Potassium level is low. Apply potassium-rich fertilizer.";

    }
    else if (moisture < 20) {

      recommendation = "Soil moisture is low. Increase irrigation.";

    }
    else {

      recommendation = "Soil condition is good. Maintain current soil management practices.";

    }


    const soil = await Soil.create({

      user: req.user.id,

      soilType,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      moisture,
      recommendation

    });


    res.status(201).json({

      success: true,

      message: "Soil analysis completed successfully",

      data: soil

    });


  }
  catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


// ===========================
// Get My Soil Analyses
// ===========================

router.get("/", auth, async (req, res) => {

  try {

    const soils = await Soil.find({

      user: req.user.id

    }).sort({ createdAt: -1 });


    res.status(200).json({

      success: true,

      count: soils.length,

      data: soils

    });

  }
  catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


// ===========================
// Get Single Soil Analysis
// ===========================

router.get("/:id", auth, async (req, res) => {

  try {

    const soil = await Soil.findOne({

      _id: req.params.id,

      user: req.user.id

    });


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

  }
  catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


// ===========================
// Update Soil Analysis
// ===========================

router.put("/:id", auth, async (req, res) => {

  try {

    const soil = await Soil.findOneAndUpdate(

      {
        _id: req.params.id,
        user: req.user.id
      },

      req.body,

      {
        new: true,
        runValidators: true
      }

    );


    if (!soil) {

      return res.status(404).json({

        success: false,

        message: "Soil analysis not found"

      });

    }


    res.status(200).json({

      success: true,

      message: "Soil analysis updated successfully",

      data: soil

    });

  }
  catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


// ===========================
// Delete Soil Analysis
// ===========================

router.delete("/:id", auth, async (req, res) => {

  try {

    const soil = await Soil.findOneAndDelete({

      _id: req.params.id,

      user: req.user.id

    });


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

  }
  catch (error) {

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

});


module.exports = router;