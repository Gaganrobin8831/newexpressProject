const mongoose = require('mongoose');
const User = require('../models/user.models'); // Assuming you have a User model defined

// Function to handle user reconnection
async function handleUserConnection(username,room) {
  try {
    // Check if the user already exists
    let user = await User.findOne({ username });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({ username ,room});
      await user.save();
      console.log(`New user created: ${username}`);
    } else {
      console.log(`User ${username} reconnected.`);
    }

    return user; // Return the user (new or existing)
  } catch (error) {
    console.error(`Error handling user connection: ${error}`);
    throw error;
  }
}

module.exports = { handleUserConnection };
