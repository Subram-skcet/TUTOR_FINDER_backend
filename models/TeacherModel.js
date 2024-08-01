const mongoose = require('mongoose')

const TeacherSchema = mongoose.Schema({
     name:{
        type:String,
        required:[true,'Please provide a name']
     },
     email:{
        type:String,
        required:[true,'Please provide a email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique:true
     },
     password:{
        type:String,
        required:[true,'Please provide a password'],
        minLength:6
     },
     qualification:{
        type:String,
        required:[true,"Please provide a qualification"]
     },
     mobileno:{
        type:String,
        required:[true,"Please provide a contact number"],
        validate:{
           validator:function(v){
            return v.length == 10
           },
           message:'Please provide a valid number'
        }
     },
     state:{
        type:String,
        required:[true,"Please provide a state"]
     },
     city:{
        type:String,
        required:[true,"Please provide a city"]
     },
     year_of_exp:{
        type:Number,
        required:[true,"Please provide a experience"]
     },
     subjects:{
        type:[String],
        required:[true,"Please provide a subject"],
        validate:{
            validator:function(v){
                return v.length>0;
            },
            message:'Please provide atlease one subject'
        }
     }
}
)

module.exports = mongoose.model('Teacher',TeacherSchema)