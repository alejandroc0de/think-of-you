const {getMessages, getPartnerName, getPartnerSender,insertMessage} = require('../services/messageService.js')
const AppError = require('../utils/AppError.js') // Importing error Handler


function messageController(io,connectedUsers){

    async function sendMessage(req,res,next) {
        const sender = req.user.id
        const message = req.body.message
        let receiver

        try {
            const result = await getPartnerSender(sender)
            // Checking if sender has no partner, if he doesnt, rowcount is 0  RETURN
            if(result.rowCount === 0){
                throw new AppError("Sender does not have a partner yet",404)
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
            next(error)
            return // so code doesnt continue in case of error
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
            next(error)
        }
    }


    async function getAllMessages(req,res, next) {
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
                    next(error) // i keep the original error from pg to display it in logs
                    return // code below so return to stop execution 
                }
            }    
            res.status(200).json({recentMessages: result.rows, message: "Messages fetched properly", partnerName : partnerName})
        } catch (error) {
            next(error)
        }
    }

    return {sendMessage,getAllMessages} // Gotta return something to the function call from Route
}

module.exports = messageController



