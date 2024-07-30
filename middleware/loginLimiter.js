const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

//rate limit options
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //60 * 1000 ms = 1 minute
    max: 5, //5 login attempts per IP 
    message:
    { message: 'Too many login attempts, try again after 60 seconds'}, //in case of more than 5 login failures
    handler: (req,res,next,options) => {
        //log the error
        logEvents(`Too many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // rate limit info appears in the RateLimit headers
    legacyHeaders: false, // Disable the X-RateLimit headers
})

module.exports = loginLimiter