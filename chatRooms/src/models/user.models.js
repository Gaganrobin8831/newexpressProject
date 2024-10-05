const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  room: {
    type: String,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
