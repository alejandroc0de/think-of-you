// The middleware is in charge of verifying the Token, if valid it continues to the Backend, its a protection. 
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Function to check the JWT
    function verifyToken(req,res,next){
        const authHeader = req.headers['authorization'] // This arrives as a string of "bearer T0k3n" so we have to split it
        if(authHeader){
            const token = authHeader.split(" ")[1] // Save the second part of the split
            // Verify creates exception in case expired, so we have to do TRY CATCH 
            try {
                jwt.verify(token, process.env.SECRET_KEY)
                next();
            } catch (error) {
                res.status(401).send("Token false")
            }
        }else{
            res.status(400).send("No TOKEN sent in headers")
        }
    }

// So other files can use it 
module.exports = verifyToken