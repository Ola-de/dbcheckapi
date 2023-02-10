require('dotenv').config()
require('express-async-errors')
require('./middleWear/verifyJWT')
const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
// const cors = require('cors')
const mongoose = require('mongoose')
const {logEvents, logger} = require('./middleWear/logger')
const errorHandler = require('./middleWear/errorHandler')
const connectDB = require('./config/dbCheck')

const PORT = process.env.PORT || 3500

connectDB()

app.use(logger)

// app.use(cors())

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', 'https://dbcheck-api.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE', 'HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'X-Requested-With', 'Accept');
    next();
})

app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoute'))

app.use('/users', require('./routes/usersRoute'))
app.use('/notes', require('./routes/notesRoute'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts('json')){
        res.json({message: 'Resources not found 400'})
    }else{
        res.type('txt').send('40 not found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to mongoDB successfully.')
    app.listen(PORT, () => console.log(`Server startted at port ${PORT} in ${process.env.NODE_ENV} mode.`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
