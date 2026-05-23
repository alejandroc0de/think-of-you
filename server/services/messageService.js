const pool = require('../db') // Imported from db file to make the queries

// This is a function to separate responsability from the route

async function getMessages (sender) {
    const result = await pool.query("SELECT * FROM messages WHERE sender = $1 OR receiver = $1 ORDER BY time_sent DESC LIMIT 20",
                                    [sender])
    return result
}

async function getPartnerName(partner) {
    const result2 = await pool.query("SELECT * FROM users WHERE id = $1",[partner])
    return result2
}

async function getPartnerSender(sender) {
    const result = await pool.query("SELECT * FROM partnerships WHERE user1_id = $1 OR user2_id = $1",[sender])
    return result
}
async function insertMessage(sender,receiver,message) {
    const result = await pool.query("INSERT INTO messages (sender, receiver, message_sent) VALUES ($1,$2,$3) RETURNING *", // Returning to access what was entered
                                    [sender, receiver,message])
    return result
}

module.exports = {getMessages,getPartnerName, getPartnerSender, insertMessage}