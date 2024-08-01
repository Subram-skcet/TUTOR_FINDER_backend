const Tution = require('../models/TutionModel')
const {StatusCodes}=require('http-status-codes')

const getAllTutions = async(req,res) =>{
    const userId = req.body.createdBy
    const tutions = await Tution.find({createdBy:userId})
    res.status(StatusCodes.OK).json({tutions})
}

const createTution = async(req,res)=>{
   const tution = await Tution.create(req.body)
   res.status(StatusCodes.CREATED).json({tution})
}

const deleteTution = async(req,res)=>{
   const {
     body:{createdBy},
     params:{id}
   } = req
    const tution= await Tution.findOneAndDelete(
        {createdBy,_id:id}
    )
    if(!tution)
        res.status(StatusCodes.NOT_FOUND).json({message:`No tution with id ${id} for this user`})
    else
       res.status(StatusCodes.OK).json({tution})
}

const updateTution = async(req,res)=>{
   const { 
        body:{
            createdBy
        },
        params:{
            id
        } 
    } = req
   const tution = await Tution.findByIdAndUpdate({_id:id,createdBy},req.body,{new:true,runValidators:true})
   if(!tution)
      res.status(StatusCodes.NOT_FOUND).json({message:`No tution with id ${id} for this user`})
   else
      res.status(StatusCodes.OK).json({tution})
}

module.exports = {
    getAllTutions,
    createTution,
    deleteTution,
    updateTution
}