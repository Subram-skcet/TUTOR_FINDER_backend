const { StatusCodes} = require('http-status-codes')
const { attachCookiesToResponse,isTokenValid } = require('../utils')
const Token = require('../models/TokenModel')

const authenticateUser = async(req,res,next)=>{
     const {accessToken,refreshToken} = req.signedCookies
     console.log("Here succeed");
    try {
        if(accessToken){
            const payload = isTokenValid(accessToken)  //if access token presents
            req.user = payload.user
            return next()
        }

        const payload = isTokenValid(refreshToken)         //Checking refresh token is valid or not accessToken is invalid
        const existingRefreshToken = await Token.find(
            {
                refreshToken:payload.refreshToken,          //Retrieving the current session of the user(token)
                userId:payload.user.userId
            }
        )

        if(!existingRefreshToken){              //If the user logged out(token not present)
            console.log("FRom this mf");
            return res.status(StatusCodes.UNAUTHORIZED).json({message:'User is unauthorized'}) //navigate to log in again
        }

        attachCookiesToResponse({res,user:payload.user,refreshToken}) //means user logged in, refresh token valid
        req.user = payload.user
        next();

    } catch (error) {
        console.log("FRom this this mf"); 
        console.log(error);
        console.log(error.message);       
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'User is unauthorized'})
    }

    // if(accessToken){
    //     try(){
    //             //if valid (no issue at all) 
    //     }catch{
    //             // if invalid (check if refresh token present,valid)
    //     }
    // }
    // else if(refreshToken){
    //     try(){
    //         //if valid (genearte new accessToken and attach it to cookie)
    //     }catch{
    //             // if invalid make the user log in again
    //     }
    // }
    //do the invalid refreshToken catch block
}

module.exports = {
    authenticateUser
}