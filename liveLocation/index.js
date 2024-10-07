const express = require('express')
const app = express()
const http = require('http').createServer(app)
const socketio = require('socket.io')
const path = require('path')
const io = socketio(http)

app.set("view engine","ejs")
app.set(express.static(path.join(__dirname,"public")))

app.get('/', function (req, res) {
    res.render('index')
})

http.listen(3000,()=>{
    console.log(`the server run on http://localhost:${3000}/`);
    
})