const jwt = require('jsonwebtoken')

const createAccessJWT = ({payload}) =>{
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'10000s'});
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


    const oneDay = 24 * 60 * 60 * 1000
    const oneMonth = 31 * 24 * 60 * 60 * 1000

    res.cookie('accessToken',accessTokenJWT,{
        signed : true,
        expires : new Date(Date.now() + oneDay)
    })

    res.cookie('refreshToken',refreshTokenJWT,{
        signed : true,
        expires: new Date(Date.now() + oneMonth)
    })
}

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    attachCookiesToResponse,
    isTokenValid
}