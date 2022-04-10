const mongoose=require("mongoose")
const productModel = require("../models/productModel")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0; // it checks, is there any key is available or not in request body
};

const productCreation = async function (req, res) {
    try {
        let requestBody = req.body;

        //validating empty req body.
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Please provide valid request body" })
        }

        //extract params for request body.
        let {
            title,
            description,
            price,
            sellerId,
            
            category
            } = requestBody

        //validation for the params starts.
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Title is required" })
        }

        //searching title in DB to maintain their uniqueness.
        const istitleAleadyUsed = await productModel.findOne({ title })
        if (istitleAleadyUsed) {
            return res.status(400).send({
                status: false,
                message: `${title} is alraedy in use. Please use another title.`
            })
        }

        

        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "Description is required" })
        }

        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "Price is required" })
        }
        if (!isValid(sellerId)) {
            return res.status(400).send({ status: false, message: "Price is required" })
        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "Price is required" })
        }
        //object destructuring for response body.
        const newProductData = {
            title,
            description,
            price,
            sellerId,
           
            category
        }

        //validating sizes to take multiple sizes at a single attempt.
       
        const saveProductDetails = await productModel.create(newProductData)
        return res.status(201).send({ status: true, message: "Product added successfully.", data: saveProductDetails })

    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is : " + err
        })
    }
}

const getProductsById = async function (req, res) {
    try {
        const productId = req.params.productId

        //validation starts.
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: `${productId} is not a valid product id` })
        }
        //validation ends.

        const product = await productModel.findOne({ _id: productId });

        if (!product) {
            return res.status(404).send({ status: false, message: `product does not exists` })
        }

        return res.status(200).send({ status: true, message: 'Product found successfully', data: product })
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is : " + err
        })
    }
}
module.exports = { productCreation, getProductsById}