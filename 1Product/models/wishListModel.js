const mongoose=require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const wishListSchema=mongoose.Schema({
products:[{
    productId:{type:ObjectId},
    
}],
user:{type:ObjectId}
},{timestamp:true});
module.exports = mongoose.model("wishList", wishListSchema)