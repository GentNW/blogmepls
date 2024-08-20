const User = require('../models/user')
const blog = require('../models/blog')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route Get /user
//@access Private

const getAllUsers = asyncHandler (async (req,res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({ message: 'No users Found'})
    }
    return res.json(users)
})


//@desc Create a user
//@route Post /user
//@access Private
const createNewUser = asyncHandler (async(req,res) => {
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
        res.status(201).json({message:`New User ${username} created and has an ID of ${User._id}`})
    } else {
        res.status(400).json({message:'invalid user data received'})
    }
})

//@desc Update a user
//@route Patch /user
//@access Private
const updateUser = asyncHandler (async(req,res) => {
    const { id, username, password, roles} = req.body

    //Confirm Data
    if(!id || !username || !roles)
    {
        return res.status(400).json({ message: 'All fields are required'})

    }

    const user = await User.findById(id).exec()
    
    if(!user)
    {
        return res.status(400).json({ message: 'User not found'})
    }

    //Checking duplicate
    const duplicate = await User.findOne({ username }).collation({locale:'en',strength: 2}).lean().exec()
    
    // Allowing updates to the original user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({ message: 'Duplicate username'})
    }

    user.username = username

    if(password){
        //Hash password
        user.password = await bcrypt.hash(password, 10) //salt rounds
    }

    // Ensuring roles is an array
    if (!Array.isArray(roles)) {
        return res.status(400).json({ message: 'Roles must be an array' });
    }

    user.roles = roles
    user.id = id
    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated with id ${user.id}`})
})

//@desc Delete a user
//@route Delete /user
//@access Private
const deleteUser = asyncHandler (async(req,res) => {
    const {id} = req.body
    if(!id){
        return res.status(400).json({message:'User ID Required'})
    }

    const blogs = await blog.findOne({ user:id }).lean().exec()
    if(blogs > 0)
    {
        return res.status(400).json({ message:'User has Blogs'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message:'user not found'})
    }


    

    const reply = `UserName ${user.username} With ID ${user._id} deleted`
    const result = await user.deleteOne()

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}