const { attachCookiesToResponse,isTokenValid } = require('../utils')
const Token = require('../models/TokenModel')
const CustomError = require('../errors')

const authenticateUser = async(req,res,next)=>{
     const {accessToken,refreshToken} = req.signedCookies
    try {
        if(accessToken){
            const payload = isTokenValid(accessToken)  //if access token presents(always presents if cookie is valid)
            req.user = payload.user
            return next()
        }

        const payload = isTokenValid(refreshToken)         //Checking refresh token is valid or not accessToken is expired

        const existingRefreshToken = await Token.findOne(
            {
                refreshToken:payload.refreshToken,   //check if it falls under active session or not(i)
                userId:payload.user.userId
            }
        )


        if(!existingRefreshToken){ 
            throw new CustomError.UnauthenticatedError('User is unauthorized')             //If the user logged out(token not present)
        }

        attachCookiesToResponse({res,user:payload.user,refreshToken:payload.refreshToken}) //means user logged in, refresh token valid
        req.user = payload.user
        next();

    } catch (error) {
        throw new CustomError.UnauthenticatedError('User is unauthorized')
    }

}

module.exports = {
    authenticateUser
}