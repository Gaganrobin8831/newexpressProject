const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  to: { // recipient
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
  from: { // sender
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
  room: {
    type: String,
    
  },
  content: { // the message content
    type: String,
   
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
