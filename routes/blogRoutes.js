const express = require('express')
const router = express.Router()
const blogsController = require('../controllers/blogController')
const verifyJWT = require('../middleware/verifyJWT')


router.use(verifyJWT)

//Routers responsible for handling the blog's CRUD
router.route('/')
    .get(blogsController.getAllBlogs) //Read
    .post(blogsController.createNewBlog) //Create
    .patch(blogsController.updateBlog) //Update
    .delete(blogsController.deleteBlog) //Delete

module.exports = router