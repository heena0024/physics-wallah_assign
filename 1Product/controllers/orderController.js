const mongoose=require("mongoose")
const orderModel = require("../models/orderModel")
const userModel = require("../models/userModel")
const cartModel = require("../models/cartModel")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};
const isValidStatus = function (status) {
    return ['pending', 'completed', 'cancelled'].indexOf(status) !== -1
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0; // it checks, is there any key is available or not in request body
};
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


//Creating order
const orderCreation = async (req, res) => {
    try {
        const userId = req.params.userId;
        const requestBody = req.body;
        const userIdFromToken = req.userId;

        //validation for request body
        if (!isValidRequestBody(requestBody)) {
            return res
                .status(400)
                .send({
                    status: false,
                    message: "Invalid request body. Please provide the the input to proceed.",
                });
        }
        //Extract parameters
        const { cartId, cancellable, status } = requestBody;

        //validating userId
        if (!isValidObjectId(userId)) {
            return res
                .status(400)
                .send({ status: false, message: "Invalid userId in params." });
        }

        const searchUser = await userModel.findOne({ _id: userId });
        if (!searchUser) {
            return res.status(400).send({
                status: false,
                message: `user doesn't exists for ${userId}`,
            });
        }
        //Authentication & authorization
        // if (searchUser._id.toString() != userIdFromToken) {
        //     res.status(401).send({ status: false, message: `Unauthorized access! User's info doesn't match` });
        //     return
        // }

        if (!cartId) {
            return res.status(400).send({
                status: false,
                message: `Cart doesn't exists for ${userId}`,
            });
        }
        if (!isValidObjectId(cartId)) {
            return res.status(400).send({
                status: false,
                message: `Invalid cartId in request body.`,
            });
        }

        //searching cart to match the cart by userId whose is to be ordered.
        const searchCartDetails = await cartModel.findOne({
            _id: cartId,
            userId: userId,
        });
        if (!searchCartDetails) {
            return res.status(400).send({
                status: false,
                message: `Cart doesn't belongs to ${userId}`,
            });
        }

        //must be a boolean value.
        if (cancellable) {
            if (typeof cancellable != "boolean") {
                return res.status(400).send({
                    status: false,
                    message: `Cancellable must be either 'true' or 'false'.`,
                });
            }
        }

        // must be either - pending , completed or cancelled.
        if (status) {
            if (!isValidStatus(status)) {
                return res.status(400).send({
                    status: false,
                    message: `Status must be among ['pending','completed','cancelled'].`,
                });
            }
        }

        //verifying whether the cart is having any products or not.
        if (!searchCartDetails.items.length) {
            return res.status(202).send({
                status: false,
                message: `Order already placed for this cart. Please add some products in cart to make an order.`,
            });
        }

        //adding quantity of every products
        const reducer = (previousValue, currentValue) =>
            previousValue + currentValue;

        let totalQuantity = searchCartDetails.items
            .map((x) => x.quantity)
            .reduce(reducer);

        //object destructuring for response body.
        const orderDetails = {
            userId: userId,
            items: searchCartDetails.items,
            totalPrice: searchCartDetails.totalPrice,
            totalItems: searchCartDetails.totalItems,
            totalQuantity: totalQuantity,
            cancellable,
            status,
        };
        const savedOrder = await orderModel.create(orderDetails);

        //Empty the cart after the successfull order
        await cartModel.findOneAndUpdate({ _id: cartId, userId: userId }, {
            $set: {
                items: [],
                totalPrice: 0,
                totalItems: 0,
            },
        });
        return res
            .status(200)
            .send({ status: true, message: "Order placed.", data: savedOrder });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};


module.exports = { orderCreation}