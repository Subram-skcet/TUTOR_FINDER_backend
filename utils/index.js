const {createAccessJWT,createRefreshJWT,attachCookiesToResponse, isTokenValid} = require('./jwt')
const createTokenUser = require('./createTokenUser')
const {attachRefreshToken, detachRefreshToken} = require('./attachRefreshToken')
const sendEmail = require('./sendEmail')
const sendVerificationEmail= require('./sendVerificationEmail')
const createOTP = require('./createOTP')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const createHash = require('./createHash')

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    attachCookiesToResponse,
    isTokenValid,
    createTokenUser,
    attachRefreshToken,
    detachRefreshToken,
    sendEmail,
    sendVerificationEmail,
    createOTP,
    sendResetPasswordEmail,
    createHash
}

