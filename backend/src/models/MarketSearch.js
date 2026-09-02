const mongoose = require("mongoose");

const marketSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    commodity: {
      type: String,
      required: true
    },
    state: {
      type: String,
      default: ""
    },
    district: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("MarketSearch", marketSearchSchema);