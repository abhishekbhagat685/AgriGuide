const mongoose = require("mongoose");

const soilSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    soilType: {
      type: String,
      required: true
    },

    nitrogen: {
      type: Number,
      required: true
    },

    phosphorus: {
      type: Number,
      required: true
    },

    potassium: {
      type: Number,
      required: true
    },

    ph: {
      type: Number,
      required: true
    },

    moisture: {
      type: Number,
      required: true
    },

    recommendation: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Soil", soilSchema);