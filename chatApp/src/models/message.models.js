const mongoose = require('mongoose');

// Define the Message schema
const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
