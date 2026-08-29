// Class created to instance new error, it inherits error so i can access all those features

class AppError extends Error {
    constructor(message,statusCode){
        super(message) // Error class expects a message when created 
        this.statusCode = statusCode
    }
}


module.exports = AppError
