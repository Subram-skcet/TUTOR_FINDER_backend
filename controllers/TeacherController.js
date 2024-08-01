const Teacher = require('../models/TeacherModel')
const {StatusCodes} = require('http-status-codes')

const getTeacher = async(req,res) =>{
    const { id } = req.params
    const teacher = await Teacher.findById({_id:id})
    if(!teacher)
        res.status(StatusCodes.NOT_FOUND).json({message:`Teacher with id ${id} not found`})
    else
       res.status(StatusCodes.OK).json({teacher})
}

const updateTeacher = async(req,res) =>{
    const {id} = req.params
    const teacher = await Teacher.findByIdAndUpdate({_id:id},req.body,{new:true,runValidators:true})
    if(!teacher)
        res.status(StatusCodes.NOT_FOUND).json({message:`Teacher with id ${id} not found`})
    else
        res.status(StatusCodes.OK).json({teacher})
}

const deleteTeacher = async(req,res) =>{
    const {id} = req.params
    const teacher = await Teacher.findByIdAndDelete({_id:id})
    if(!teacher)
        res.status(StatusCodes.NOT_FOUND).json({message:`Teacher with id ${id} not found`})
    else
        res.status(StatusCodes.OK).json({teacher})
}

const createTeacher = async(req,res) =>{
    const teacher = await Teacher.create(req.body)
    res.status(StatusCodes.CREATED).json({teacher})
}

module.exports = {
    getTeacher,
    updateTeacher,
    deleteTeacher,
    createTeacher
}


