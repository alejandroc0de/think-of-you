const {registerUserService,loginUserService} = require('../services/authService.js')
require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

function authController(){

    // REGISTER REQUEST - We received the register req, and save the password to the DB
    async function registerUser(req,res,next){
        // next in order to use error handler
        try {
            const {name,username,password} = req.body
            const hashedPassword = await bcrypt.hash(password,saltRounds) // Encrypt password
            const result = await registerUserService(name,username,hashedPassword) // Call to the service to communicate with DB!
            res.status(201).json({message:"Response Ok"})
        } catch (error) {
            next(error) // error handler
        }
    }

    // LOGIN REQUEST - We received the login request, bring the client, and then compare if password is the same. RowCount > 0 in case no results found 
    async function loginUser(req,res) {
        try {
            const {username,password} = req.body
            const result = await loginUserService(username); // I get the user info if exists
            if (result.rowCount>0){
                if (await bcrypt.compare(password , result.rows[0].password)){    // Compare with password
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
    }
    return {registerUser,loginUser}
}

module.exports = authController


// we gotta install postgress to check functions