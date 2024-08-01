const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique:true
    },
    password:{
        type:String,
        required:[true,'PLease provide password'],
        minLength:6
    },
    likedReviews:{
        type:[mongoose.Types.ObjectId],
        ref:'Teacher',
        default:[]
    },
    dislikedReviews:{
        type:[mongoose.Types.ObjectId],
        ref:'Teacher',
        default:[]
    },
    favouriteTutions:{
        type:[mongoose.Types.ObjectId],
        ref:'Tution',
        default:[]
    }
})

module.exports = mongoose.model('Student',StudentSchema)