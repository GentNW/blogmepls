const express = require('express')
const router = express.Router()
const usersController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')


router.use(verifyJWT)

//Routers responsible for handling the user's CRUD
router.route('/')
    .get(usersController.getAllUsers) //Read
    .post(usersController.createNewUser) //Create
    .patch(usersController.updateUser) //Update
    .delete(usersController.deleteUser) //Delete

module.exports = router