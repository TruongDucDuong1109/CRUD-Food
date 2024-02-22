//not Found

const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.status(404);
    next(error);
};

//Eroor Handler
const errorHandler = (err, req, res, next) => {
    console.log(err); // Log the error for debugging
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🍰' : err.stack,
    });
};



module.exports = {errorHandler, notFound};
