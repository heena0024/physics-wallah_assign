const mongoose= require("mongoose");

const productSchema= new mongoose.Schema({
title:{type:String},
description:{type:String},
price:{type:Number},

sellerId:{type:mongoose.Schema.Types.ObjectId,required:true},
category:[{type:String,required:true}]
},{timestamps:true})
module.exports=mongoose.model("product",productSchema)

