const express = require('express')
const mongo = require('mongodb')
const session = require('express-session')
const ejs = require('ejs')
const bodyParser = require('body-parser')

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

app.use(bodyParser.urlencoded({extended: true}))
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
app.get('/messages', messages)
app.get('/match', match)
app.get('/profile', profile)
app.get('*', error)
app.get('/', home)
app.post('/message', add)


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
// function messages(request, response) {
//     response.render('messages')
// }


//add user input to database
function add(request, response) {
    console.log(request.body)
    db.collection('chat').insertOne({
        message: request.body.message,
        username: 'sharon'
    })
    response.redirect('back')
}

//place messages from database into chat
function messages(request, response, next) {
    db.collection('chat').find().toArray(done)
    function done(err, data) {
        if (err) {
            next(err)
        }
        else {
            console.log(data)
            data.forEach((message) => {
                if (message.username === 'sharon') {
                    message.ownMessage = true
                }
            })
            //const isLoggedIn = request.body.username !== undefined
           response.render('messages', { data: data})
        }
    }
}