// src/controllers/messageController.js
const Message = require('../models/message.models');

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Create a new message
const createMessage = async (req, res) => {
  const { user, content } = req.body;

  if (!user || !content) {
    return res.status(400).json({ message: 'User and content are required' });
  }

  try {
    const newMessage = new Message({ user, content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create message', error });
  }
};

module.exports = {
  getMessages,
  createMessage,
};
