const express = require("express");

const router = express.Router();

const Fertilizer = require("../models/Fertilizer");

const auth = require("../middleware/authMiddleware");


// ===========================
// Add Fertilizer
// ===========================

router.post("/add",auth,async(req,res)=>{

try{

const fertilizer=await Fertilizer.create(req.body);

res.status(201).json({

success:true,

message:"Fertilizer added successfully",

data:fertilizer

});

}

catch(error){

res.status(500).json({

success:false,

error:error.message

});

}

});



// ===========================
// Get All
// ===========================

router.get("/",auth,async(req,res)=>{

try{

const fertilizers=await Fertilizer.find();

res.json({

success:true,

count:fertilizers.length,

data:fertilizers

});

}

catch(error){

res.status(500).json({

success:false,

error:error.message

});

}

});



// ===========================
// Recommend Fertilizer
// ===========================

router.post("/recommend",auth,async(req,res)=>{

try{

const{

crop,

soilType,

nitrogen,

phosphorus,

potassium

}=req.body;

const recommendation=await Fertilizer.findOne({

crop,

soilType,

nitrogen,

phosphorus,

potassium

});

if(!recommendation){

return res.status(404).json({

success:false,

message:"No fertilizer recommendation found"

});

}

res.json({

success:true,

data:recommendation

});

}

catch(error){

res.status(500).json({

success:false,

error:error.message

});

}

});



// ===========================
// Update
// ===========================

router.put("/:id",auth,async(req,res)=>{

try{

const fertilizer=await Fertilizer.findByIdAndUpdate(

req.params.id,

req.body,

{

new:true,

runValidators:true

}

);

if(!fertilizer){

return res.status(404).json({

success:false,

message:"Record not found"

});

}

res.json({

success:true,

message:"Updated successfully",

data:fertilizer

});

}

catch(error){

res.status(500).json({

success:false,

error:error.message

});

}

});




// ===========================
// Delete
// ===========================

router.delete("/:id",auth,async(req,res)=>{

try{

const fertilizer=await Fertilizer.findByIdAndDelete(req.params.id);

if(!fertilizer){

return res.status(404).json({

success:false,

message:"Record not found"

});

}

res.json({

success:true,

message:"Deleted successfully"

});

}

catch(error){

res.status(500).json({

success:false,

error:error.message

});

}

});

module.exports=router;