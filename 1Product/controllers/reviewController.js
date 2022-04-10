const mongoose= require("mongoose")

const productModel = require("../models/productModel")
const reviewModel = require("../models/reviewModel")


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
};

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidRating = function (rating) {
    return [1, 2, 3, 4, 5].indexOf(rating) > -1;
};
//////////////////////////////////     CREATE REVIEW /////////////////////
const createReview = async function (req, res) {
    try {
        const requestBody = req.body;
        const _id = req.params.productId;
        let { reviewedBy, rating, review } = requestBody;

        if (!isValidObjectId(_id)) {
            res
                .status(400)
                .send({ status: false, message: "productId should be valid" });
            return;
        }

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({
                status: false,
                message: "Please provide valid data in request body",
            });
            return;
        }
 
        let productDetails = await productModel.findOne({ _id});
        if (!productDetails) {
            res
                .status(404)
                .send({ status: false, message: "No product exist with this ID" });
            return;
        }

        if (!isValid(rating)) {
            res.status(400).send({ status: false, message: "Rating is required" });
            return;
        }

        if (!isValidRating(rating)) {
            res
                .status(400)
                .send({ status: false, message: "Rating should be from 1 to 5" });
            return;
        }

        if (reviewedBy && !isValid(reviewedBy)) {
            res
                .status(400)
                .send({ status: false, message: "Reviewer's name should be valid" });
            return;
        }

        const reviewDetails = { reviewedBy, rating, review, productId: _id };
        await reviewModel.create(reviewDetails);
        const reviews = productDetails["reviews"] + 1;
        let updatedProductDetails = await productModel.findOneAndUpdate(
            { _id },
            { reviews },
            { new: true }
        );
        const reviewDatas = await reviewModel.find({ productId: _id });
        let data = { ...updatedProductDetails["_doc"], reviewData: reviewDatas };

        return res.status(200).send({
            status: true,
            message: "review created successfully",
            data: data,
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};
module.exports = { createReview}