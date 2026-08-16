const pool = require('../db') // import db file to make queries 


async function registerUserService(name,username,hashedPassword) {
    const result = await pool.query("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",[name,username,hashedPassword])
    return result
}

async function loginUserService(username) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result
}

// Used ..Service in the function so it doesnt duplicate functions on controller

module.exports = {registerUserService,loginUserService}