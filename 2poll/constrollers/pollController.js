const pollModel= require('../models/pollModel');
const createPoll= async (req,res)=>{
    try{
        const requestBody=req.body;
        let{name, authorId, options}= requestBody
        const data = {name:name,authorId:authorId,options:options}
        console.log("data",data)
        const savedata= await pollModel.create(data)
        return res.status(201).send({status:true,message:savedata})
    }catch(err){res.status(500).send({status:false,msg:err.msg})}
}
module.exports = { createPoll }
