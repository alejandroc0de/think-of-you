const express = require ('express')
const router = express.Router()
const pool = require('../db') // Imported from db file to make the queries
const bcrypt = require('bcrypt')
const saltRounds = 10

// Router allows us to manage the routes here without putting all in the server file. We export it to use it in server 


router.post('/register', async (req,res) =>{
    const {name,username,password} = req.body
    const hashedPassword = await bcrypt.hash(password,saltRounds)
    const result = await pool.query("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",[name,username,hashedPassword])
    console.log(hashedPassword)
})

module.exports = router