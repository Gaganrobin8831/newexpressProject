require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const connectDBrooms = require('./DB/database');
const User = require('./models/user.models');
const Message = require('./models/message.models');
const { handleUserConnection } = require('./services/handleReconnect'); // Import the handleUserConnection function

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Connect to the database and set up Socket.IO
connectDBrooms()
  .then(() => {
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle room joining
      socket.on('join room', async ({ username, room }) => {
        try {
          // Use the handleUserConnection function to manage user state
          const user = await handleUserConnection(username,room);

          // Join the room
          socket.join(room);
          console.log(`${username} joined room: ${room}`);

          // Fetch and send previous messages from this room
          const messages = await Message.find({ room }).sort({ timestamp: 1 });
          socket.emit('previous messages', messages);

          // Notify others in the room about the user joining
          socket.to(room).emit('message', `${user.username} has joined the room.`);
        } catch (error) {
          console.error('Error handling room join:', error);
        }
      });

      // Handle sending a new message in the room
      socket.on('chat message', async ({ username, room, message }) => {
        try {
          // Save the new message to the database
          const newMessage = new Message({ user: username, room, content: message });
          await newMessage.save();

          // Broadcast the message to the room
          io.to(room).emit('chat message', { user: username, content: message });
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      // Handle user disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to DB:', error);
  });
