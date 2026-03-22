// Route to post the messages sent from the client

const express = require ('express')
const router = express.Router()
const pool = require('../db') // Imported from db file to make the queries
const verifyToken = require('../middleware/auth')



// WE NEED ACCESS TO IO IN MESSAGES, so we receive io from server, then using arrow function complete the logic and finally return the router since server is waiting for one. 
module.exports = (io, connectedUsers) => {

    // We place the middleware before so we first check that 
    router.post('/', verifyToken, async (req,res,) => {
        // Extract data from the body, id comes from the decoded middleware
        const sender = req.user.id
        const message = req.body.message
        let receiver 

        // Try to find the partner of the sender
        try {
            const result = await pool.query("SELECT * FROM partnerships WHERE user1_id = $1 OR user2_id = $1",[sender])

            // Checking if sender has no partner, if he doesnt, rowcount is 0  RETURN
            if(result.rowCount === 0){
                res.status(404).json({message : "Sender does not have a partnet yet"})
                return
            }

            // Here we setup the info about who is sender and who is receiver
            if(result.rows[0].user1_id == sender ){ 
                // receiver is user2
                receiver = result.rows[0].user2_id
            }else{
                // receiver is user1
                receiver = result.rows[0].user1_id
            }
        } catch (error) {
            res.status(404).json({message : "Sender does not have a partner yet"})
            console.log(error)
            return
        }

        // Now i send the message to the table messages 

        try {
            const insertResult = await pool.query("INSERT INTO messages (sender, receiver, message_sent) VALUES ($1,$2,$3) RETURNING *", // Returning to access what was entered
                                                [sender, receiver,message])
            res.status(201).json({message : "Message saved properly"})
            // Realtime Update using SOCKET IO
            if(connectedUsers[receiver]){
                connectedUsers[receiver].emit("send",{"sender": sender, "time": insertResult.rows[0].time_sent, "message":message}) // Send the message to the receiver in Realtime
            }
        } catch (error) {
            res.status(500).json({message : "There is a problem saving the message to the DB"})
            console.log(error)
        }
    })

    return router
}

