const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route Post /auth
//@access Public
const login =  asyncHandler(async(req,res) => {
    //authenticate user
    const{username,password} = req.body

    if(!username||!password){
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser =  await User.findOne({ username }).exec()

    if(!foundUser){
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if(!match){
        return res.status(401).json({ message: 'Unauthorized'})
    }

    //Token Creation

    //Access token
    const accessToken = jwt.sign({
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m'}
    )

    //Refresh token
    const refreshToken = jwt.sign(
        { "username": foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
    )

    //Create cookie with refresh token
    res.cookie('jwt',refreshToken,{
        httpOnly: true, //only accessible by web server
        secure:true, //https
        sameSite: 'None', //cross-site cookies
        maxAge: 7 * 24 * 60 * 60 *1000 //Cookie expiry should match refresh token's expiration time

    })

    // Send access token with the username and roles
    res.json({ accessToken })
})

// @desc refresh
// @route Get /auth/refresh
//@access Public - because access token has expired
const refresh =  asyncHandler((req,res) => {
    const cookies = req.cookies

    if(!cookies?.jwt){
        return res.status(401).json({message: 'Unauthorized'})
    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err,decoded) =>{
            if(err){
                return res.status(403).json({ message: 'Forbidden'})
            }

            const foundUser = await User.findOne({ username: decoded.username})

            if(!foundUser){
                return res.status(401),json({message: 'Unauthorized'})
            }

            const accessToken = jwt.sign({
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '1m'}
            )

            res.json({ accessToken })
        })
    )

})

// @desc Login
// @route Post /auth/logout
//@access Public - clear cookie if it exists
const logout =  (req,res) => {
    const cookies  = req.cookies
    if(!cookies?.jwt){
        return res.sendStatus(204) // no content
    }

    res.clearCookie('jwt',{
        httpOnly:true,
        sameSite:'None',
        secure:true})

    res.json({message: "Cookie cleared"})
}

module.exports = {
    login,
    refresh,
    logout
}