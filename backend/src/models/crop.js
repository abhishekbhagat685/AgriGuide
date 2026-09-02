const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
  soilType: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  crop: {
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
  timestamps: true
});

module.exports = mongoose.model("Crop", cropSchema);