const express = require ('express')
const http = require('http')

const app = express()


const server = http.createServer((app) => {

    // Route Get 
    app.get('/', (req,res) => {
        console.log("App waiting for get request")
        res.send("Response sent")
    })
})





server.listen(3000, 'localhost', () => {
    console.log("Server running in localhost")
})