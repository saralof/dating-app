// const path = require('path')
const express = require('express')
const mongo = require('mongodb')
const session = require('express-session')

//setup dotenv
require('dotenv').config()

//declare express
const app = express()

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

app
    .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { sameSite: true,}
    }))
    .listen(process.env.SERVER_PORT, () => {
        console.log('Server is up on port ' + process.env.SERVER_PORT)
    })
    app.get('/', function (req, res) {
        res.send('hello world')
    })
