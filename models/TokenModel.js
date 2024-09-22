const mongoose = require('mongoose')

const TokenSchema = mongoose.Schema({
    refreshToken:{
        type:'String',
        required:true
    },
    userId:{
       type:mongoose.Types.ObjectId,
       required:true,
       refPath:'userPath',
    },
    userPath:{
        type:String,
        required:true,
        enum:['Teacher','Student']
    },
    createdAt:{
        type:Date,
        default:Date.now,
        index:{ expires:'30d'}
    }
})

module.exports = mongoose.model('Token',TokenSchema)