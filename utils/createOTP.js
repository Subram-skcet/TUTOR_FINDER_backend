const generateOTP = (length) =>{
    let otp = '';
    const characters = '0123456789';
  
    for (let i = 0; i < length; i++) {
      otp += characters[Math.floor(Math.random() * characters.length)];
    }
  
    return otp;
}

module.exports = generateOTP