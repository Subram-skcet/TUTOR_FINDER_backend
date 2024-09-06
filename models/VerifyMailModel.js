const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const VerifyMailSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    timeCreated:{
        type:Date,
        default:Date.now,
        index:{ expires:'15m'}
    }
})

VerifyMailSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.otp = await bcrypt.hash(this.otp,salt)
})

VerifyMailSchema.methods.compareOTP = async function(candidateotp){
    console.log(candidateotp);
    const isMatch = await bcrypt.compare(candidateotp,this.otp)

    return isMatch
}

module.exports = mongoose.model('VerifyMail',VerifyMailSchema)