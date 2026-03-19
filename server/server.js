const pool = require('./db') // Imported from db file to make the queries
const express = require ('express')
const http = require('http') 
const {Server} = require('socket.io')
// So http for createServer, that server receives app as the route handler. Socket.io allows bidirectional comms, without making lots of reqs

const app = express()
app.use(express.json()) // So that app can parse JSON and add it to the body 

const server = http.createServer(app) // Any req? send it to Express
const io = new Server(server,{
// Without cors it wont accept request from another port React Port 
    cors:{
        origin : "http://localhost:5173"
    }
}) // io will live within server for websockets 


// ROUTES FOR THE APP 


const authRoutes = require('./Routes/auth')
app.use('/auth', authRoutes) // As a middleware it send all routes that have the word auth to the authRoutes we imported


const messageRoute = require('./Routes/messages')
app.use('/messages', messageRoute)




io.on("connection", (socket) => {
    console.log("Someone connected to app", socket.id)
})


server.listen(3000, () => {
    console.log("Server running in localhost")
})