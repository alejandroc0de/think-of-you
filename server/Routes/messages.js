// Route to post the messages sent from the client
const express = require ('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const messageController = require('../controller/messageController.js')


// WE NEED ACCESS TO IO IN MESSAGES, so we receive io from server, then using arrow function complete the logic and finally return the router since server is waiting for one. 
module.exports = (io, connectedUsers) => {
// this just exports whatever is inside the arrow function

    const controller = messageController(io,connectedUsers)
    router.post('/',verifyToken,controller.sendMessage)
    router.get('/', verifyToken, controller.getAllMessages)

    return router
}

