const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = ({name,email,token,origin}) => {
    const resetURL = `${origin}/api/v1/auth/reset-password?token=${token}&email=${email}`
    const message = `<p>Please reset your password by clicking on the following link
                     <a href=${resetURL}>Reset Password</a>`
    return sendEmail({
        to:email,
        subject:'Reset Password',
        html:`Hello ${name} 
              ${message}`
    })
}

module.exports = sendResetPasswordEmail