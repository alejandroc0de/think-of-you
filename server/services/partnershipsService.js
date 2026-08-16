const pool = require('../db') // db queries 
// this is a function to seperate functions from the routes

async function partnerCheckService(client) {
    const result = await pool.query("SELECT EXISTS (SELECT 1 FROM partnerships WHERE user1_id = $1 OR user2_id = $1)", [client])
    return result
}

async function partnerSearchService(usernamePartner) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1 ",[usernamePartner])
    return result
}

async function partnerLinkingService(client, partner_id) {
    const result = await pool.query("INSERT INTO partnerships (user1_id, user2_id) VALUES ($1, $2)",[client, partner_id])
    return result
}
module.exports = {partnerCheckService,partnerSearchService,partnerLinkingService}