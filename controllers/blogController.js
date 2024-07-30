const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@route Get /user
//@access Private

const getAllBlogs = asyncHandler (async (req,res) => {
    const blogs = await Blog.find().select().lean()
    if(!blogs?.length){
        return res.status(400).json({ message: 'No blogs Found'})
    }
    return res.json(blogs)
})


//@desc Create a blog
//@route Post /blog
//@access Private
const createNewBlog = asyncHandler (async(req,res) => {
    //user's blog number variable should increase by 1 here

    const { title , textContent} = req.body

    //Confirm Data
    if(!title, !textContent)
    {
        return res.status(400).json({ message:'All fields are required' })
    }

    //Check for Duplicate
    const duplicate = await Blog.findOne({ title }).collation({locale:'en', strength: 2}).lean().exec()

    if(duplicate){
        return res.status(409).json({ message:'Duplicate title '})
    }

    const userObject = { title, textContent}


    //create & store new user
    const blog = await Blog.create(userObject)
    if(blog){ //created
        res.status(201).json({message:`New blog ${title} created`})
    } else {
        res.status(400).json({message:'invalid blog data received'})
    }
})

//@desc Update a blog
//@route Patch /blog
//@access Private
const updateBlog = asyncHandler (async(req,res) => {
    const { id ,title, textContent} = req.body

    //Confirm Data
    if(!id||!title || !textContent)
    {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const blog = await Blog.findById(id).exec()

    if(!blog)
    {
        return res.status(400).json({ message: 'Blog not found'})
    }

    //Check duplicate
    const duplicate = await Blog.findOne({ title }).collation({locale:'en', strength: 2}).lean().exec()
    // Allow updates to the original user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({ message: 'Duplicate title'})
    }

    blog.title = title
    blog.textContent = textContent

    const updatedBlog = await blog.save()

    res.json({ message: `${updatedBlog.title} updated`})
})

//@desc Delete a user
//@route Delete /user
//@access Private
const deleteBlog = asyncHandler (async(req,res) => {
    //user's blog number variable should decrease by 1 here


    const {id} = req.body
    if(!id){
        return res.status(400).json({message:'Blog ID Required'})
    }

    const blog = await Blog.findById(id).exec()

    if(!blog){
        return res.status(400).json({message:'blog not found'})
    }


    

    const reply = `blog:${blog.title} With ID ${blog._id} deleted`
    const result = await blog.deleteOne()

    res.json(reply)
})

module.exports = {
    getAllBlogs,
    createNewBlog,
    updateBlog,
    deleteBlog
}