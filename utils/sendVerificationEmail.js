const sendEmail = require('./sendEmail')


const sendVerificationEmail = async({
    email,
    otp,
}) => {

    const message = `<p>The OTP to verify your email is <strong>${otp}</strong>. Note that the OTP is valid for only 15 minutes.</p>`

    return sendEmail({
        to:email,
        subject:'Email Confirmation',
        html:`<h4>Welcome to FMT(Find My Tuition)</h4>
              ${message}`
    })
}

module.exports = sendVerificationEmail