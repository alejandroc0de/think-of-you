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






module.exports = router // So that server can use it 