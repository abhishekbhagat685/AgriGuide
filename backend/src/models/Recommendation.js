console.log("Recommendation Model Loaded");
const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    soilType: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    recommendedCrop: {
      type: String,
      required: true,
    },
    seed: {
      type: String,
      required: true,
    },
    fertilizer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);