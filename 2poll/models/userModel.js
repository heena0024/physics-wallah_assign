const mongoose=require("mongoose");
const userSchema= mongoose.Schema({
    password:{type:String},
    name:{type:String},
    phone:{type:Number},
    address:{type:String}
},{timestamp:true});
module.exports= mongoose.model("user",userSchema)