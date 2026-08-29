const AppError = require('../utils/AppError.js') // Importing error Handler


function errorHandler(err,req,res,next){ // 4 args, so node knows it is an error handler
    console.error(err) // This helps with debugging

    if(err.code === "23505"){
        return res.status(400).json({message: "Username is taken"})
    }

    // Here we asked if this error was created by the class, (ej. username empty) this would be useful to return to the front, so we do that
    // using that specific error message we created in the class!!
    if(err instanceof AppError){
        return res.status(err.statusCode).json({message: err.message})
    }

    res.status(500).json({message: "Something went wrong"})
}

module.exports = errorHandler

// Null to keep the design in all error responses