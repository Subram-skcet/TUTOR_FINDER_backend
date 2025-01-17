const nodemailer = require('nodemailer')
const nodemailerConfig = require('./nodemailerConfig')

const sendEmail = ({to,subject,html}) =>{
    const transporter = nodemailer.createTransport(nodemailerConfig)

    return transporter.sendMail({
        from:'FMT_ADMIN <official@gmail.com>',
        to,
        subject,
        html
    })
}

module.exports = sendEmail