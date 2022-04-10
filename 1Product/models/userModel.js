const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    //email: { type: String, unique: true, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, min: 8, max: 15, required: true }, // encrypted password
    phone: { type: String, unique: true, required: true },
    address: [{type :String}
    ]
},{timestamps:true})

module.exports=mongoose.model("user",userSchema)