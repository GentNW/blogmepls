const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Create a user
//@route Post /user
//@access Private
const registerNewUser = asyncHandler (async(req,res) => {
    const { username, password, roles} = req.body

    //Confirm Data
    if(!username || !password)
    {
        return res.status(400).json({ message:'All fields are required' })
    }

    //Check for Duplicate
    const duplicate = await User.findOne({ username }).collation({locale:'en',strength: 2}).lean().exec()

    if(duplicate){
        return res.status(409).json({ message:'Duplicate username '})
    }

    //Hash password
    const hashedPwd = await bcrypt.hash(password, 10) //salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length)
    ? { username, "password": hashedPwd}
    : { username, "password": hashedPwd,roles}

    //create & store new user
    const user = await User.create(userObject)
    if(user){ //created
        res.status(201).json({message:`New User ${username} created`})
    } else {
        res.status(400).json({message:'invalid user data received'})
    }
})

module.exports = {
    registerNewUser
}