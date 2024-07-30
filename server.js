require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } =  require('./middleware/logger')
const errorHandler = require('./middleware/errorhandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json()) 

app.use(cookieParser())

//Grabbing files in the public folder
app.use('/',express.static(path.join(__dirname, 'public')))

//Obtaining the root from the routes folder
app.use('/',require('./routes/root'))
//Authenticator
app.use('/auth',require('./routes/authRoutes'))
//User
app.use('/users',require('./routes/userRoutes'))
//Blog
app.use('/blogs',require('./routes/blogRoutes'))


//Catching all (error handling mostly)
app.all('*',(req,res) => {

    //Handling a not found error
    res.status(404)
    if(req.accepts('html'))
    {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } 
    else if(req.accepts('json'))
    {
        res.json({ message : "404 Not Found"})
    } 
    else
    {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

//Running the server
mongoose.connection.once('open',()=>{
    console.log('connected to mongoDB')
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))
})

//Catching connection error
mongoose.connection.on('error',err =>{
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongErrLog.log')
})