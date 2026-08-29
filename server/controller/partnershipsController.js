const {partnerCheckService, partnerSearchService, partnerLinkingService} = require('../services/partnershipsService.js')
const AppError = require('../utils/AppError.js') // Importing error Handler


function partnershipsController(){

    async function partnerCheck(req,res,next) {
        const client = req.user.id // Via middleware token = 48 
        try {
            const result = await partnerCheckService(client) // call to service to check DB
            if(result.rows[0].exists == false){
                throw new AppError("Client does not have a partner" , 404)
            }
            res.status(200).json({message: "Client has partner"})
        } catch (error) {
            next(error) // Error handler
        }
    }

    async function partnerLinking(req,res,next) {
        const client = req.user.id
        const usernamePartner = req.body.username
        try {
            const result = await partnerSearchService(usernamePartner)
            if(result.rowCount == 0){
                throw new AppError("User is not in thinkofu",404) // IMPORTANT, Front has a conditional based on this, do not add another throw 404 or front will fail to render
            }else{
                const partner_id = result.rows[0].id
                if(partner_id == client){
                    throw new AppError("You cant link with yourself",422) // IMPORTANT, Front has conditional based on this code 
                }
                try {
                    const result2 = await partnerLinkingService(client,partner_id)
                    res.status(200).json({message: "Partnership updated succesfully"})
                } catch (error) {
                    if(error.code == "23505"){
                        throw new AppError("Partner already has a partner",400) // IMPORTANT Front has conditional based on this error
                    }
                    next(error) // Error handler
                    return
                }
            }
        } catch (error) {
            next(error)
        }
    }
    return {partnerCheck,partnerLinking}
}

module.exports = partnershipsController
