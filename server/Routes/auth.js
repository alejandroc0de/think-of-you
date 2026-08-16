const express = require('express')
const router = express.Router()
const authController = require('../controller/authController.js')


const controller = authController()
router.post('/register',controller.registerUser)
router.post('/login', controller.loginUser)


module.exports = router

// Check register, what if username already there 