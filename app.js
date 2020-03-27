const express = require('express')
const mongo = require('mongodb')
const session = require('express-session')
const ejs = require('ejs');

//setup dotenv
require('dotenv').config()

//declare express
const app = express()

const publicDirectoryPath = ('public')

//db setup
let db = null
const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT

mongo.MongoClient.connect(url, function (err, client) {
    if (err) {
        throw err
    }
    console.log("database running")
    db = client.db(process.env.DB_NAME)
})


app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.static(publicDirectoryPath))
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { sameSite: true,}
    }))
app.listen(process.env.SERVER_PORT, () => {
    console.log('Server is up on port ' + process.env.SERVER_PORT)
})
app.get('/', home)
app.get('/messages', message)
app.get('/match', match)
app.get('/profile', profile)
app.get('*', error)
app.get('/', home)


function home(request, response) {
    response.render('index')
}
function match(request, response) {
    response.render('match')
}
function profile(request, response) {
    response.render('profile')
}



function error(request, response) {
    response.render('404')
}