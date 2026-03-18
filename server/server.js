const pool = require('./db') // Imported from db file to make the queries
const express = require ('express')
const http = require('http') 
const {Server} = require('socket.io')
// So http for createServer, that server receives app as the route handler. Socket.io allows bidirectional comms, without making lots of reqs

const app = express()
const server = http.createServer(app) // Any req? send it to Express
const io = new Server(server,{
// Without cors it wont accept request from another port React Port 
    cors:{
        origin : "http://localhost:5173"
    }
}) // io will live within server for websockets 


io.on("connection", (socket) => {
    console.log("Someone connected to app", socket.id)
})



// Route Get 
app.get('/', (req,res) => {
    console.log("App waiting for get request")
    res.send("Response sent")
})

server.listen(3000, () => {
    console.log("Server running in localhost")
})