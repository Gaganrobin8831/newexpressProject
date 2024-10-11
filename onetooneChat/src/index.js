require('dotenv').config();
const express = require('express');
const router = require('./routes/app.routes');
const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);
const cookieParser = require('cookie-parser');
const Message = require('./models/message.models')
const User = require('./models/user.models')

const path = require('path'); // Import the path module
const connctDBforChat = require('./DB/database');

const port = process.env.PORT || 2121;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

connctDBforChat()
.then(() => {
    console.log('Connected to MongoDB');
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
    
        // Handle chat message
        socket.on('chatMessage', async ({message, room,to,from }) => {
            // console.log({message, room,to,from });
            const todata = await User.findOne({
                FullName:to})
            console.log(todata);
            
    // const userId = await User.

            const msg = new Message({ room, content:message,to:todata._id,from}); // Save the message with the room info
            await msg.save(); // Save to database
            io.to(room).emit('recivemessage', message); // Broadcast message to the room
        });
    
        // Handle joining a room
        socket.on('joinRoom',async(room) => {
            socket.join(room); // Join the specific room
    
            // Retrieve the chat history from the database for the room
           const allMesaageHistoryofusers = await Message.find({ room })
           console.log(allMesaageHistoryofusers);
           socket.emit('chatHistory', allMesaageHistoryofusers); 
        //    allMesaageHistoryofusers.map((messages) => {
        //         const chatHistory = messages.message // Extract messages
        //        // Send the chat history to the client
        //     });
        });
    
        // Handle leaving a room
        socket.on('leaveRoom', (room) => {
            socket.leave(room);
        });
    
        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    
    // Start the server
    http.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});