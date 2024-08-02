const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const StudentSchema = new mongoose.Schema({
    profilepic:{
        type:String,
    },
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
        required:[true,'Please provide password'],
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

StudentSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

module.exports = mongoose.model('Student',StudentSchema)