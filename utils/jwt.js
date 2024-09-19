const jwt = require('jsonwebtoken')

const createAccessJWT = ({payload}) =>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'15m'});
    return token
}

const createRefreshJWT = ({payload}) =>{
    const token = jwt.sign(payload,process.env.JWT_SECRET)
    return token
}

const isTokenValid = (token) =>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

const attachCookiesToResponse = ({res,user,refreshToken}) =>{
    const accessTokenJWT = createAccessJWT({payload:{user}})
    const refreshTokenJWT = createRefreshJWT({payload:{user,refreshToken}})

    console.log(accessTokenJWT, refreshTokenJWT);


    const oneDay = 60 * 15 * 1000 //15 minutes

    res.cookie('accessToken', accessTokenJWT, {
        signed: true,
        expires: new Date(Date.now() + oneDay),
        httpOnly: true     // Prevent access from JavaScript
    });
    
    res.cookie('refreshToken', refreshTokenJWT, {
        signed: true,
        expires: new Date(Date.now() + oneMonth),
        httpOnly: true     // Prevent access from JavaScript
    });
}

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    attachCookiesToResponse,
    isTokenValid
}