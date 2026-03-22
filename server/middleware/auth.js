// The middleware is in charge of verifying the Token, if valid it continues to the Backend, its a protection.
// If the middleware is ok it returns the decoded info, for rn the username
const jwt = require('jsonwebtoken')
require('dotenv').config()

// Function to check the JWT
    function verifyToken(req,res,next){
        const authHeader = req.headers['authorization'] // This arrives as a string of "bearer T0k3n" so we have to split it
        if(authHeader){
            const token = authHeader.split(" ")[1] // Save the second part of the split
            // Verify creates exception in case expired, so we have to do TRY CATCH 
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                req.user = decoded // I saved username and id so this is a JSON sent to the route to save the messages using id 
                console.log(decoded)
                next();
            } catch (error) {
                res.status(401).json({message : "Token false"})
            }
        }else{
            res.status(400).json({message : "No TOKEN sent in headers"})
        }
    }

// So other files can use it 
module.exports = verifyToken


// It is best to bring the username from the JWT, if we trust the body people could inyect another sender if they send a JSON format
// Here we know the username based on his Token 
