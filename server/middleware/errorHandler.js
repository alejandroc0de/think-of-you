function errorHandler(err,req,res,next){ // 4 args, so node knows it is an error handler
    console.log(err) // This helps with debugging

    if(err.code === "23505"){
        return res.status(400).json({message: "Duplicate Entry", error: err.code})
    }
    res.status(500).json({message: "Something went wrong"})
}

module.exports = errorHandler