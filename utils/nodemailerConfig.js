module.exports = {
    host:'smtp-relay.brevo.com',
    port:587,
    secure:false,
    auth:{
        user:'subram666666@gmail.com',
        pass:`${process.env.MAIL_PWD}`
    }
}