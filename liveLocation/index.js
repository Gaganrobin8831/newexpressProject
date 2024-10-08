const express = require('express')
const app = express()
const http = require('http').createServer(app)
const socketio = require('socket.io')
const path = require('path')
const io = socketio(http)

app.set("view engine","ejs")


app.get('/', function (req, res) {
    res.render('index')
})
io.on("connection",(socket)=>{

    socket.on("send-location",(data)=>{
        io.emit("recive-location",{id:socket.id,...data})
    })
    console.log("User Connected"+socket.id);

    socket.on("disconnect",()=>{
        console.log("User disconnect" + socket.id);
        io.emit("User-disconnect",socket.id)
    })
})
http.listen(3000,()=>{
    console.log(`the server run on http://localhost:${3000}/`);
    
})