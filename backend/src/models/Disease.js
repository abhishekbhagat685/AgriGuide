const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    image: {
        type: String,
        required: true
    },

    crop: {
        type: String,
        required: true
    },

    disease: {
        type: String,
        required: true
    },

    confidence: {
        type: Number,
        required: true
    },

    recommendation: {
        type: String,
        default: "Consult a local agricultural expert."
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Disease", diseaseSchema);