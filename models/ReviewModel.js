const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'Student',
        required:true
    },
    review:{
        type:String,
        message:"Your review can't be empty",
        required:true,
        minLength:1
    },
    createdFor:{
        type:mongoose.Types.ObjectId,
        ref:'Student',
        required:true
    },
    like:{
        type:Number,
        default:0
    },
    dislike:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model('Reviews',ReviewSchema)