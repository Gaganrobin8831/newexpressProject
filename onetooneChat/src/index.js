require('dotenv').config()
const express = require('express')
const router = require('./routes/app.routes')
const app = express()
const http = require('http').createServer(app)
const {Server } = require('socket.io')
const io = new Server(http);


const path = require('path'); // Import the path module
const connctDBforChat = require('./DB/database')


const port = process.env.PORT || 2121
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/',router)

connctDBforChat()
.then(()=>{
    io.on('connection',(socket)=>{
        console.log('a user connected',socket.id)

        socket.on('chatMessage',(data)=>{
            // console.log(data)

            socket.emit('recivemessage',data)
    
            
        })
    
        socket.on('disconnect',()=>{
            console.log('user disconnected',socket.id)
        })
    })

    http.listen(port,()=>{
            console.log(`The APP RUN ON PORT http://localhost:${port}/`)
    })
})
.catch((error)=>{
    console.log(error);
    
})


