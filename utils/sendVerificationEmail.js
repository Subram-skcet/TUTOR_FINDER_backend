const sendEmail = require('./sendEmail')


const sendVerificationEmail = async({
    email,
    otp,
}) => {

    const message = `<p>The OTP to verify your email is ${otp}</p>`

    return sendEmail({
        to:email,
        subject:'Email Confirmation',
        html:`<h4>Welcome to EduQuest</h4>
              ${message}`
    })
}

module.exports = sendVerificationEmail