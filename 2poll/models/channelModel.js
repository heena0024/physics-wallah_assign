const mongoose= require("mongoose");
const objectId= mongoose.Schema.Type.objectId;
const channelSchema=  new mongoose.Schema({
    name:{type:string},
    usersCount:{type:Number},
    creator:{type:objectId},
    user:[{type:string}]
},{timestamp:true});
module.exports=mongoose.model("channel",channelSchema)