const mongoose=require("mongoose");
const voteSchema= mongoose.Schema({
    pollId:{type:objectId},
    userId:{type:objectId},
    answer:{type:String}
},{timestamp:true});
module.exports= mongoose.model("votes",voteSchema)