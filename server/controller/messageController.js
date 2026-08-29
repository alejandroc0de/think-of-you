const {getMessages, getPartnerName, getPartnerSender,insertMessage} = require('../services/messageService.js')
const AppError = require('../utils/AppError.js') // Importing error Handler


function messageController(io,connectedUsers){

    async function sendMessage(req,res) {
        const sender = req.user.id
        const message = req.body.message
        let receiver

        try {
            const result = await getPartnerSender(sender)
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
            const insertResult = await insertMessage(sender,receiver,message) // Call to SERVICES
            res.status(201).json({message : "Message saved properly", messageObj : insertResult}) // Rerturning entered
            // Realtime Update using SOCKET IO
            if(connectedUsers[receiver]){
                connectedUsers[receiver].emit("send",{"sender": sender, "time_sent": insertResult.rows[0].time_sent, "message_sent":message}) // Send the message to the receiver in Realtime
            }
        } catch (error) {
            res.status(500).json({message : "There is a problem saving the message to the DB"})
            console.log(error)
        }
    }


    async function getAllMessages(req,res) {
        const sender = req.user.id // via middleware id for sender
        try {
            const result = await getMessages(sender)
            let partner
            let partnerName
            if (result.rowCount>0){
                if(result.rows[0].sender == sender){
                    partner = result.rows[0].receiver
                }else{
                    partner = result.rows[0].sender
                }
                try {
                    // I do this extra call to get the partner name and be able to use it in the frontend
                    const result2 = await getPartnerName(partner)
                    partnerName = result2.rows[0].name
                } catch (error) {
                    res.status(500).json({message: "Error fetching partner name", error : error})
                    console.log(error)
                }
            }    
            res.status(200).json({recentMessages: result.rows, message: "Messages fetched properly", partnerName : partnerName})
        } catch (error) {
            res.status(500).json({message: "Error fetching last messages", error : error})
        }
    }

    return {sendMessage,getAllMessages} // Gotta return something to the function call from Route
}

module.exports = messageController



