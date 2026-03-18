const express = require ('express')
const router = express.Router()
const pool = require('../db') // Imported from db file to make the queries
const bcrypt = require('bcrypt')
const saltRounds = 10

// Router allows us to manage the routes here without putting all in the server file. We export it to use it in server 


// REGISTER REQUEST - We received the register req, and save the password to the DB
router.post('/register', async (req,res) =>{
    try {
        const {name,username,password} = req.body
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        const result = await pool.query("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",[name,username,hashedPassword])
        res.status(201).send("Response Ok")
    } catch (error) {
        res.status(400).send("Error when registering to the Database")
    }
})

// LOGIN REQUEST - We received the login request
router.post('/login', async(req,res) => {
    try {
        const {username,password} = req.body
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username])
        if (result.rowCount>0){
            if (await bcrypt.compare(password , result.rows[0].password)){
                res.status(202).send("Login Succesfull")
            }else{
                res.status(401).send("Wrong Credentials")
            }
        }else{
            res.status(401).send("Wrong Credentials")
        }
    } catch (error) {
        res.status(400).send("Error when trying to login from server")
        console.log(error)   
    }
})



module.exports = router