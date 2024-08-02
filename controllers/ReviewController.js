const Review = require('../models/ReviewModel')
const Student = require('../models/StudentModel')
const Teacher = require('../models/TeacherModel')
const {StatusCodes} = require('http-status-codes')

const getReviews = async(req,res)=>{
    const reviews = await Review.find(req.body)
    res.status(StatusCodes.OK).json({reviews})
}

const createReview = async(req,res)=>{
    const {createdBy,createdFor}  = req.body
    const user = await Student.findById({_id:createdBy})
    const teacher = await Teacher.findById({_id:createdFor})
    if(!user){
        res.status(StatusCodes.NOT_FOUND).json({message:`The student with id ${createdBy} not exists`})
    }
    if(!teacher){
        res.status(StatusCodes.NOT_FOUND).json({message:`The teacher with id ${createdFor} not exist`})
    }
    // const alreadySubmitted = Review.findOne({
    //     createdBy:createdBy,
    //     createdFor:createdFor
    // })
    // if(alreadySubmitted){
    //     console.log(alreadySubmitted);
    //     res.status(StatusCodes.BAD_REQUEST).json({message:`The review already submitted`})
    // }
    // else{
        const review = await  Review.create(req.body)
        res.status(StatusCodes.CREATED).json({review})
    // }
}

const deleteReview = async(req,res)=>{
    const {id} = req.params
    const review = Review.findById({_id:id})
    if(!review){
        res.status(StatusCodes.NOT_FOUND).json({message:`No Review with id ${id} exists`})
    }
    else{
        const delReview = await Review.findByIdAndDelete({_id:id})
        res.status(StatusCodes.OK).json({delReview})
    }
}

const updateReview = async(req,res)=>{
    console.log('Update Reviews');
}

module.exports = {
    getReviews,
    createReview,
    deleteReview,
    updateReview
}