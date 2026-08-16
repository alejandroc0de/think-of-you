// Route to get partner and set partner
const express = require('express')
const router = express.Router() // Separate responsability from server file
const verifyToken = require('../middleware/auth')
const partnershipsController = require('../controller/partnershipsController')

const controller = partnershipsController()
router.get('/',verifyToken,controller.partnerCheck)
router.post('/',verifyToken,controller.partnerLinking)

module.exports = router // So that server can use it 