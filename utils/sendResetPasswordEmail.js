const sendEmail = require('./sendEmail')

const sendResetPasswordEmail = ({name,email,token,origin,role}) => {
    const resetURL = `${origin}/reset-password?token=${token}&role=${role}&email=${email}`
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