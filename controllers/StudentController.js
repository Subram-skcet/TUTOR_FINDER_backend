const Student = require('../models/StudentModel')
const {StatusCodes} = require('http-status-codes')

const getStudent = async(req,res)=>{
    const { id } = req.params
    const student = await Student.findById({_id:id})
    if(!student){
        res.status(StatusCodes.NOT_FOUND).json({message:`Student with id ${id} not found!`})
    }
    else{
        res.status(StatusCodes.OK).json({student})
    }
}

const createStudent = async(req,res)=>{
    console.log(req.method);
    const student =await  Student.create(req.body)
    res.status(StatusCodes.CREATED).json({student})
}

const updateStudent = async(req,res)=>{
   const { id } = req.params
   const user = await Student.findByIdAndUpdate({_id:id},req.body,{new:true,runValidators:true})
                                              //id, update, options

   if(!user)
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'No user found' });
   
   res.status(StatusCodes.OK).json({user})
}

const deleteStudent = async(req,res)=>{
    const { id } = req.params
    const user = await Student.findByIdAndDelete({_id:id})

    if(!user)
         return res.status(StatusCodes.NOT_FOUND).json({message:`No user with id ${id}`})
    res.status(StatusCodes.OK).json({message:'Success'})
}

module.exports = {
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
}
