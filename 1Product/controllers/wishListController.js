const mongoose = require("mongoose")
const userModel = require("../models/userModel")

const productModel = require("../models/productModel")
const wishListModel = require("../models/wishListModel")

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const createWishList= async (req,res)=>{
    try{
    userId= req.params.userId;
    productId= req.body.productId

        if (!isValidObjectId(userId)) {
            return res
                .status(400)
                .send({ status: false, message: "Invalid userId in params." });
        }
        if (!isValidObjectId(productId)) {
            return res
                .status(400)
                .send({ status: false, message: "Invalid productId in body." });
        }
        const searchUser = await userModel.findOne({ _id: userId });
        if (!searchUser) {
            return res.status(400).send({
                status: false,
                message: `user doesn't exists for ${userId}`,
            });
        }
        const searchProduct = await productModel.findOne({ _id: productId });
        if (!searchProduct) {
            return res.status(400).send({
                status: false,
                message: `user doesn't exists for ${productId}`,
            });
        }
const data={
    userId,
    products:[{productId:productId,}]
}
console.log("data",data)
const saveData= await wishListModel.create(data)
     return res.status(200).send({
            status: true,
            message: "wishlist created successfully",
            data: saveData,
        });
   
    
    }  catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }}
module.exports={createWishList}