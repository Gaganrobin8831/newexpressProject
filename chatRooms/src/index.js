require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const connectDBrooms = require('./DB/database');
const User = require('./models/user.models');
const Message = require('./models/message.models');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

connectDBrooms()
.then(()=>{
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
      
        socket.on('join room', async ({ username, room }) => {
            console.log(`Username: ${username}, Room: ${room}`); // Debugging
          socket.join(room);
          console.log(`${username} joined room: ${room}`);
          // Save the user in the database
          const newUser = new User({ username, room });
          await newUser.save();
      
          console.log(`${username} joined room: ${room}`);
          
          // Notify other users in the room
          socket.to(room).emit('message', { user: 'System', content: `${username} has joined the room.` });
      
          // Fetch and send previous messages in the room
          const messages = await Message.find({ room }).sort({ timestamp: 1 });
          socket.emit('previous messages', messages);
        });
      
        // Handle sending messages in a room
        socket.on('chat message', async ({ username, room, message }) => {
          const newMessage = new Message({ user: username, room, content: message });
      
          await newMessage.save();
      
          io.to(room).emit('chat message', { user: username, content: message });
        });
      
        // Handle user disconnect
        socket.on('disconnect', async () => {
          console.log(`User disconnected: ${socket.id}`);
          // Remove the user from the database or mark them as inactive
        });
      });

    server.listen(port ,()=>{
        console.log(`server is running on http://localhost:${port}/`)
    })
})
.catch((error)=>{
    console.log(error)
})