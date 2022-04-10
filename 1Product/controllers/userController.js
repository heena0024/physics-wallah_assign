const userModel= require("../models/userModel")
const jwt = require("jsonwebtoken")
 

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0; // it checks, is there any key is available or not in request body
};
const userCreation = async(req, res) => {
    try {
        let requestBody = req.body;
        let {
            name,
            phone,
            password,
            address,
        } = requestBody

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "requestBody is required" })
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "name is required" })
        }
        
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "phone number is required" })
        }

        //searching phone in DB to maintain its uniqueness
        const isPhoneAleadyUsed = await userModel.findOne({ phone })
        if (isPhoneAleadyUsed) {
            return res.status(400).send({
                status: false,
                message: `${phone} is already in use, Please try a new phone number.`
            })
        }

        //validating phone number of 10 digits only.
        if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone))) return res.status(400).send({ status: false, message: "Phone number must be a valid Indian number." })

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "Password must be of 8-15 letters." })
        }
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "Address is required" })
        }
        
       
        //validation ends
        const userData={        name:name,
            phone:phone,
            password:password,
            address:address,
           
        }

        const saveUserData = await userModel.create(userData);
        return res
            .status(201)
            .send({
                status: true,
                message: "user created successfully.",
                data: saveUserData
            });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is : " + err
        })
    }
}

//user login by validating the email and password.
const userLogin = async function(req, res) {
    try {
        const requestBody = req.body;

        // Extract params
        const { phone, password } = requestBody;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "requestBody is required" })
        }
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "phone number is required" })
        }
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        //finding user's details in DB to verify the credentials.
        const user = await userModel.findOne({ phone });

        if (!user) {
            return res.status(401).send({ status: false, message: `Login failed! phone is incorrect.` });
        }
        const userPass= user.password
        if (password != userPass){
    return res.status(401).send({status:false, message:"password not valid"})
}
        
        //Creating JWT token through userId. 
        const userId = user._id
        const token = await jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000), //time of issuing the token.
            exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7 //setting token expiry time limit.
        }, 'password logined')

        return res.status(200).send({
            status: true,
            message: `user login successfull `,
            data: {
                userId,
                token
            }
        });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { userCreation, userLogin}