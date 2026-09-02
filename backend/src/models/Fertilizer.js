const mongoose = require("mongoose");

const fertilizerSchema = new mongoose.Schema(
{
    crop:{
        type:String,
        required:true
    },

    soilType:{
        type:String,
        required:true
    },

    nitrogen:{
        type:String,
        required:true
    },

    phosphorus:{
        type:String,
        required:true
    },

    potassium:{
        type:String,
        required:true
    },

    fertilizer:{
        type:String,
        required:true
    },

    quantity:{
        type:String,
        required:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Fertilizer",fertilizerSchema);