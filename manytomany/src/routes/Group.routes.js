const express = require('express');
const Group = require('../models/Goups.models');
const authenticate = require('../middleware/authentication');
// const authorize = require('../middleware/authorize');
const router = express.Router();
const User = require('../models/user.models');

router.get('/create', authenticate, async (req, res) => {
  try {
    const { GroupName, createBy, Users } = req.query;
    
    // Ensure all required fields are present
    if (!GroupName || !Users) {
      return res.status(400).json({ message: "GroupName and Users are required" });
    }

    // Check if the user exists
    const isExitUser = await User.findOne({ name: Users });
    if (!isExitUser) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Create or update the group, adding the user if it exists
    const groupMember = await Group.updateOne(
      { GroupName, createBy: req.user._id },
      { $push: { Users: isExitUser._id } },
      { upsert: true }
    );

    res.status(201).json({ message: 'Group created successfully', group: groupMember });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/assign', authenticate, async (req, res) => {
  try {
    const { GroupName, Users } = req.query;

    // Ensure all required fields are present
    if (!GroupName || !Users) {
      return res.status(400).json({ message: "GroupName and Users are required" });
    }

    // Check if user exists
    const user = await User.findOne({ name: Users });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Add user to the group
    const group = await Group.updateOne(
      { GroupName },
      { $addToSet: { Users: user._id } }  // $addToSet avoids duplicates
    );

    res.status(200).json({ message: 'User assigned to group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Remove User from Group
router.get('/remove', authenticate, async (req, res) => {
  try {
    const { GroupName, Users } = req.query;

    // Ensure all required fields are present
    if (!GroupName || !Users) {
      return res.status(400).json({ message: "GroupName and Users are required" });
    }

    // Find user to remove
    const user = await User.findOne({ name: Users });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Remove user from the group
    const group = await Group.updateOne(
      { GroupName },
      { $pull: { Users: user._id } }  // $pull removes matching items
    );

    res.status(200).json({ message: 'User removed from group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete Group (Only Group Creator)
router.get('/delete', authenticate, async (req, res) => {
  try {
    const { GroupName } = req.query;

    // Ensure required field
    if (!GroupName) {
      return res.status(400).json({ message: "GroupName is required" });
    }

    // Find the group
    const group = await Group.findOne({ GroupName });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the requesting user is the creator
    if (group.createBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the group creator can delete the group" });
    }

    // Delete the group
    await Group.deleteOne({ _id: group._id });

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//List Users in a Group
router.get('/listUsers', authenticate, async (req, res) => {
  try {
    const { GroupName } = req.query;

    // Ensure required field
    if (!GroupName) {
      return res.status(400).json({ message: "GroupName is required" });
    }

    // Use aggregation to lookup users in the group
    const group = await Group.aggregate([
      { $match: { GroupName } },
      { $lookup: {
          from: 'users',
          localField: 'Users',
          foreignField: '_id',
          as: 'groupUsers'
      }},
      { $unwind: '$groupUsers' }
    ]);

    res.status(200).json({ users: group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//. List All Groups for a User
router.get('/listGroups', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregate to get groups for a user
    const groups = await Group.aggregate([
      { $match: { Users: userId } },
      { $lookup: {
          from: 'users',
          localField: 'createBy',
          foreignField: '_id',
          as: 'creator'
      }},
      { $unwind: '$creator' }
    ]);

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
