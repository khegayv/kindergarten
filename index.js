const express=require('express')
const ejs=require('ejs')
const session=require('express-session')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const bodyParser=require('body-parser')
const http = require('http')
require('dotenv').config({path:'./config/.env'})

const userRoutes = require('./routes/route')

const app=express()

const server = http.createServer(app)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
    .catch((error) => console.log(error.message))

app.set('view engine', 'ejs')
app.set('views')

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

app.use(userRoutes)

app.use(session({
    secret: '312;adfskghjktmdgfm,',
    resave: false,
    saveUninitialized: false
}))

