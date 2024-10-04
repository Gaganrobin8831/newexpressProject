require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const connectDB = require('./DB/database');
const port = process.env.PORT
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const Message = require('./models/message.models')

// Serve static files and views
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// MongoDB connection
connectDB()
  .then(() => {
    // When a client connects
    io.on('connection', async (socket) => {
        console.log('A user connected:', socket.id);
      
        // Generate a unique username based on the socket ID
        const username = `User${socket.id.slice(-4)}`;
      
        // Fetch and send previous messages when a user connects
        try {
          const previousMessages = await Message.find().sort({ timestamp: 1 });
          socket.emit('previous messages', previousMessages); // Send old messages to the connected user
        } catch (error) {
          console.error('Error fetching previous messages:', error);
        }
      
        // Listen for incoming chat messages
        socket.on('chat message', async (msgData) => {
          const messageContent = msgData.content;
      
          // Create a new message document
          const message = new Message({
            user: username,
            content: messageContent,
          });
      
          try {
            // Save the message to the database
            await message.save();
            console.log('Message saved:', message);
      
            // Broadcast the message to all connected users
            io.emit('chat message', { user: username, content: messageContent });
          } catch (error) {
            console.error('Error saving message:', error);
          }
        });
      
        // Handle user disconnect
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
      });
      
  server.listen(port, () => {
    console.log(`SERVER RUNNING ON http://localhost:${port}/`);
  });
  
  })
  .catch((err) => console.log('Error connecting to DB:', err));

