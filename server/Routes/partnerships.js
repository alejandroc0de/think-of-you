// Route to get partner and set partner
const express = require('express')
const pool = require('../db') // db queries 
const router = express.Router() // Separate responsability from server file
const verifyToken = require('../middleware/auth')



router.get('/', verifyToken, async(req,res) => {
    const client = req.user.id // Via middleware token = 48 
    try {
        const result = await pool.query("SELECT EXISTS (SELECT 1 FROM partnerships WHERE user1_id = $1 OR user2_id = $1)", [client])
        if(result.rows[0].exists == false){
            res.status(404).json({Message : "Client does not have a partner"})
            return
        }
        res.status(200).json({message: "Client has partner"})
    } catch (error) {
        res.status(400).json({message: "Error when checking partner" , error})
    }
})

    router.post('/', verifyToken, async(req,res) => {
        const client = req.user.id
        const usernamePartner = req.body.username
        try {
            const result = await pool.query("SELECT * FROM users WHERE username = $1 ",[usernamePartner])
            if(result.rowCount == 0){
                res.status(404).json({message: "Username is not in thinkingofyou", error: "007"}) // Error to render a conditional message on front
            }else{
                const partner_id = result.rows[0].id
                if(partner_id == client){
                    res.status(404).json({message: "You cannot match with yourself lol"}) // If client tries to match with itself
                    return
                }
                try {
                    const result2 = await pool.query("INSERT INTO partnerships (user1_id, user2_id) VALUES ($1, $2)",[client, partner_id])
                    res.status(200).json({message: "Partnership updated succesfully"})
                } catch (error) {
                    if(error.code == "23505"){
                        res.status(400).json({message: "Partner already has partner", error: error.code})
                        return
                    }
                    res.status(400).json({message: "Error when creating partnership", error: error})
                }
            }
        } catch (error) {
            res.status(400).json({message: "Error when saving partner to database"})
        }
    })





module.exports = router // So that server can use it 