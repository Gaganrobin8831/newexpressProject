const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
},{timestamps:true});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
