const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,'Please provide rating']
    },
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
        ref:'Teacher',
        required:true
    },
    like:{
        type:[mongoose.Types.ObjectId],
        ref:'Student',
        deafult:[]
    },
    dislike:{
        type:[mongoose.Types.ObjectId],
        ref:'Student',
        deafult:[]
    }
},{timestamps:true})

ReviewSchema.index({createdBy:1,createdFor:1},{unique:true})

ReviewSchema.statics.calculateAverageRating = async function(teacherId){
    const result = await this.aggregate(
        [
            {$match : {createdFor:teacherId}},
            {$group :{
                _id:null,
                averageRating: {$avg:'$rating'},
                numOfReviews: {$sum:1}
            }}
        ]
    )

    try{
        await this.model('Teacher').findOneAndUpdate(
            {_id:teacherId},
            {
                averageRating:Math.ceil(result[0]?.averageRating || 0),
                numOfReviews:Math.ceil(result[0]?.numOfReviews || 0)
            }
        )
    }
    catch(error){
        console.log(error);
    }
}

ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.createdFor)
})

ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.createdFor)
})



module.exports = mongoose.model('Reviews',ReviewSchema)