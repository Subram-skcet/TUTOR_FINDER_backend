const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const TeacherSchema = mongoose.Schema({
      profilepic:{
         type:String,
      },
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
     district:{
        type:String,
        required:[true,"Please provide a districttt"]
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
     },
      about:{
         type:String,
         minLength:5
      },
     averageRating:{
         type:Number,
         default:0,
      },
     numOfReviews:{
      type:Number,
      default:0,
     },
     numOfTutions:{
       type:Number,
       default:0
     }
}
)

TeacherSchema.virtual('reviews',{
   ref:'Review',
   localField:'_id',
   foreignField:'createdFor',
   justOne:false
})

TeacherSchema.pre('deleteOne',async function(next){
   console.log("Executing before delete One");

    const conditions = this.getQuery();

   // conditions =  { _id: new ObjectId('66ae0849353608962239c7f9') }

    const doc = await mongoose.model('Teacher').findOne(conditions);

    //doc contains the document to be deleted
    
    //Here we pass the id of the teacher to get deleted at Review Model
   await mongoose.model('Review').deleteMany({createdFor:doc._id})
})

TeacherSchema.pre('save',async function(){
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password,salt)
})

module.exports = mongoose.model('Teacher',TeacherSchema)