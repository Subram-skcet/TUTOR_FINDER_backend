const { StatusCodes} = require('http-status-codes')
const { attachCookiesToResponse,isTokenValid } = require('../utils')
const Token = require('../models/TokenModel')

const authenticateUser = async(req,res,next)=>{
     const {accessToken,refreshToken} = req.signedCookies
    //  console.log(accessToken, refreshToken);
    try {
        if(accessToken){
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }

        const payload = isTokenValid(refreshToken)
        const existingRefreshToken = await Token.find(
            {
                refreshToken:payload.refreshToken,
                userId:payload.user.userId
            }
        )

        if(!existingRefreshToken){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:'User is unauthorized'})
        }

        attachCookiesToResponse({res,user:payload.user,refreshToken})
        req.user = payload.user
        next();

    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'User is unauthorized'})
    }
}

module.exports = {
    authenticateUser
}