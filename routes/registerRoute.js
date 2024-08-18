const express = require('express')
const router = express.Router()
const registerController = require('../controllers/registerController')

//Router responsible for handling the user's registration
router.route('/')
    .post(registerController.registerNewUser) //Create

module.exports = router