const {partnerCheckService, partnerSearchService, partnerLinkingService} = require('../services/partnershipsService.js')
const pool = require('../db') // db queries 
const express = require('express')

function partnershipsController(){

    async function partnerCheck(req,res) {
        const client = req.user.id // Via middleware token = 48 
        try {
            const result = await partnerCheckService(client) // call to service to check DB
            if(result.rows[0].exists == false){
                res.status(404).json({Message : "Client does not have a partner"})
                return
            }
            res.status(200).json({message: "Client has partner"})
        } catch (error) {
            res.status(400).json({message: "Error when checking partner" , error})
        }
    }

    async function partnerLinking(req,res) {
        const client = req.user.id
        const usernamePartner = req.body.username
        try {
            const result = await partnerSearchService(usernamePartner)
            if(result.rowCount == 0){
                res.status(404).json({message: "Username is not in thinkingofyou", error: "007"}) // Error to render a conditional message on front
            }else{
                const partner_id = result.rows[0].id
                if(partner_id == client){
                    res.status(404).json({message: "You cannot match with yourself lol"}) // If client tries to match with itself
                    return
                }
                try {
                    const result2 = partnerLinkingService(client,partner_id)
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
    }
    return {partnerCheck,partnerLinking}
}

module.exports = partnershipsController
