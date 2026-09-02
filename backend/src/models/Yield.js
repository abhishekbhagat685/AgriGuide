const mongoose = require("mongoose");

const yieldSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    crop:{
        type:String,
        required:true
    },

    soilType:{
        type:String,
        required:true
    },

    area:{
        type:Number,
        required:true
    },

    rainfall:{
        type:Number,
        required:true
    },

    temperature:{
        type:Number,
        required:true
    },

    humidity:{
        type:Number,
        required:true
    },

    predictedYield:{
        type:Number,
        required:true
    },

    unit:{
        type:String,
        default:"kg/hectare"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Yield", yieldSchema);