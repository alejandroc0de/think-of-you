const express = require ('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const pool = require('../db') // Imported from db file to make the queries
const bcrypt = require('bcrypt')
const saltRounds = 10
require('dotenv').config()

// Router allows us to manage the routes here without putting all in the server file. We export it to use it in server 



// REGISTER REQUEST - We received the register req, and save the password to the DB
router.post('/register', async (req,res) =>{
    try {
        const {name,username,password} = req.body
        const hashedPassword = await bcrypt.hash(password,saltRounds) // Encrypt password
        const result = await pool.query("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",[name,username,hashedPassword])
        res.status(201).json({message:"Response Ok"})
    } catch (error) {
        res.status(400).json({message: "Error when registering to the db", error: error.code})
    }
})



// LOGIN REQUEST - We received the login request, bring the client, and then compare if password is the same. RowCount > 0 in case no results found 
router.post('/login', async(req,res) => {
    try {
        const {username,password} = req.body
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]) // I get the user info if exists
        if (result.rowCount>0){
            if (await bcrypt.compare(password , result.rows[0].password)){                      // Compare with password
                // JWT!
                var token = jwt.sign({"username":result.rows[0].username, "id":result.rows[0].id},process.env.SECRET_KEY,{expiresIn: '7d'})  // Add JWT and encrypt username and Id for middleware
                res.status(200).json({token: token}) // I return the token once user is logged in 
            }else{
                res.status(401).json({result :"Wrong Credentials"})
            }
        }else{
            res.status(401).json({result :"Wrong Credentials"})
        }
    } catch (error) {
        res.status(400).send("Error when trying to login from server")
        console.log(error)   
    }
})

module.exports = router





// Check register, what if username already there 