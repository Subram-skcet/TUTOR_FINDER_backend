const Review = require('../models/ReviewModel')
const {StatusCodes} = require('http-status-codes')

const getReviews = async(req,res)=>{
    console.log('Getting Reviews');
}

const createReview = async(req,res)=>{
    console.log('Creating reviews')
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