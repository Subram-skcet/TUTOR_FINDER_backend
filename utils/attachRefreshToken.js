const Token = require('../models/TokenModel')
const { attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const crypto = require('crypto')

const attachRefreshToken = async(res,{role,id}) =>{
    let refreshToken = ''
    
        const existingToken = await Token.findOne({userId:id}) //not found after 30 days or loggedout
        if(existingToken){
            refreshToken = existingToken.refreshToken
        }
        else{
            refreshToken = crypto.randomBytes(40).toString('hex')
            await Token.create(
                {
                    refreshToken,
                    userId:id,
                    userPath:role === 'student'? 'Student':'Teacher' //valid for next 30 days
                }
            )
            
        }
        const tokenUser = createTokenUser({role,_id:id}) 
        attachCookiesToResponse({res,user:tokenUser,refreshToken})
}

const detachRefreshToken = async(res,{id}) =>{
    await Token.findOneAndDelete({userId:id})

    res.cookie('accessToken','remove',{
        httpOnly:true,
        expires:new Date(Date.now())
    })

    res.cookie('refreshToken','remove',{
        httpOnly:true,
        expires:new Date(Date.now())
    })
}

module.exports = {
    attachRefreshToken,
    detachRefreshToken
}