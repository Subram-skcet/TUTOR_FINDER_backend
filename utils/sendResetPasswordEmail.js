const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = ({name,email,token,origin,role}) => {
    const resetURL = `${origin}/reset-password?token=${token}&role=${role}&email=${email}`
    const message = `<p>Please reset your password by clicking on the following link. Note that the link is valid for only 10 minutes.
                     <a href=${resetURL}>Reset Password</a>`
    return sendEmail({
        to:email,
        subject:'RESET PASSWORD',
        html:`Hello ${name} Welcome to <strong>FMT(Find My Tuition)</strong> ${message}`
    })
}

module.exports = sendResetPasswordEmail