// Import module for Postgres, we use pool since client only accepts 1 request at the same time, pool multiple
const {Pool} = require('pg')
require('dotenv').config() // This allows us using dotenv variables 

const pool = new Pool({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    password : process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT) // FOr issue when deploying, receiving as string 
})

module.exports = pool // Exported in CommonJS
