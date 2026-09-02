const mongoose = require("mongoose");

const cropCalendarSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      unique: true
    },

    season: {
      type: String,
      required: true
    },

    sowingMonths: {
      type: String,
      required: true
    },

    harvestMonths: {
      type: String,
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    irrigation: {
      type: String,
      required: true
    },

    temperature: {
      type: String,
      required: true
    },

    rainfall: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CropCalendar", cropCalendarSchema);