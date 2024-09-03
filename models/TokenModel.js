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
    }
})

module.exports = mongoose.model('Token',TokenSchema)