const Review = require('../models/ReviewModel')
const {StatusCodes} = require('http-status-codes')

const getReviews = async(req,res)=>{
    const reviews = await Review.find(req.body)
    res.status(StatusCodes.OK).json({reviews})
}

const createReview = async(req,res)=>{
    const review = await  Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}

const deleteReview = async(req,res)=>{
    console.log('Deleting Reviews')
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