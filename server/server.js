const pool = require('./db') // Imported from db file to make the queries
const express = require ('express')
const http = require('http') 
const {Server} = require('socket.io') // So http for createServer, that server receives app as the route handler. Socket.io allows bidirectional comms, without making lots of reqs
require('dotenv').config()
const jwt = require('jsonwebtoken')

const connectedUsers = {} // Json obj to save connected users, this is in server memory 

const app = express()
app.use(express.json()) // So that app can parse JSON and add it to the body 

const server = http.createServer(app) // Any req? send it to Express
const ioServer = new Server(server,{
// Without cors it wont accept request from another port React Port 
    cors:{
        origin : "http://localhost:5173"
    }
}) // io will live within server for websockets 


// ROUTES FOR THE APP 


const authRoutes = require('./Routes/auth')
app.use('/auth', authRoutes) // As a middleware it send all routes that have the word auth to the authRoutes we imported


const messageRoute = require('./Routes/messages')(ioServer,connectedUsers) // This return the function in the path, we pass IO as args,and then we use that function when a message hits
app.use('/messages', messageRoute)


// The socket.id changes on reload, so i have to link that socket with an user. So when a message is sent and both users are online, the partner will get the message in realtime.
// Each time user is connected i have to map the new socket to his username, and we can extract that from the Token. (Socket) has the info comming from the front request 
ioServer.use((socket , next) => {
    const token = socket.handshake.auth.token
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        socket.username = decoded.username // Now the socket has the info of the username and id 
        socket.user_id = decoded.id
        next()
    } catch (error) {   
        next(new Error("Authentication Error"))
    }
})
// Second step after USE, id and username are saved to the socket object. So now we can save it to the JSON with the connections 
ioServer.on("connection", (socket) => {
    console.log("Someone connected to app", socket.id)
    connectedUsers[socket.user_id] = socket // Saving whole socket object to have access to emit ()

    socket.on("disconnect", () => {
        delete connectedUsers[socket.user_id]
    })
})


server.listen(3000, () => {
    console.log("Server running in localhost")
})