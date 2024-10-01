const express = require('express');
const Group = require('../models/Goups.models');
const authenticate = require('../middleware/authentication');
// const authorize = require('../middleware/authorize');
const router = express.Router();
const User = require('../models/user.models');
const ObjectId = require('mongoose').Types.ObjectId


router.get('/create', authenticate, async (req, res) => {
  try {
    const { GroupName, createBy, Users } = req.query;


    if (!GroupName || !Users) {
      return res.status(400).json({ message: "GroupName and Users are required" });
    }


    const isExitUser = await User.findOne({ name: Users });
    if (!isExitUser) {
      return res.status(400).json({ msg: "User does not exist" });
    }


    const groupMember = await Group.updateOne(
      { GroupName, createBy: req.user._id },
      { $push: { Users: isExitUser._id } },
      { upsert: true }
    );

    res.status(201).json({ message: 'Group created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/assign', authenticate, async (req, res) => {
  try {
    const { GroupName, Users } = req.query;


    if (!GroupName || !Users) {
      return res.status(400).json({ message: "GroupName and Users are required" });
    }


    const user = await User.findOne({ name: Users });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }


    const group = await Group.updateOne(
      { GroupName },
      { $addToSet: { Users: user._id } }
    );

    res.status(200).json({ message: 'User assigned to group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// remove user from group
router.get('/remove', authenticate, async (req, res) => {
  try {
    const { GroupName, Users } = req.query;


    if (!GroupName || !Users) {
      return res.status(400).json({ message: "GroupName and Users are required" });
    }
const isGroupExit = await Group.findOne({GroupName})
if (!isGroupExit) {
  return res.status(400).json({ message: "Group does not exist" });
}

    const user = await User.findOne({ name: Users });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const userId = user._id
    // const userId = new ObjectId(user._id);
    const groups = await Group.aggregate([
      {
        $match: {
          Users: {
            $in: [
              userId
            ]
          }

        }
      }
    ]);
    console.log(groups);

    if (Object.keys(groups).length === 0) {
      return res.status(400).json({ msg: 'User not Exits in  Group' });
    }
    // Remove user from the group
    const group = await Group.updateOne(
      { GroupName },
      { $pull: { Users: userId } },
      { new: true }
    );
    console.log(group);

    res.status(200).json({ message: 'User removed from group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete Group (Only Group Creator)
router.get('/delete', authenticate, async (req, res) => {
  try {
    const { GroupName } = req.query;


    if (!GroupName) {
      return res.status(400).json({ message: "GroupName is required" });
    }

    const group = await Group.findOne({ GroupName });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }


    if (group.createBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the group creator can delete the group" });
    }


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


    if (!GroupName) {
      return res.status(400).json({ message: "GroupName is required" });
    }


    const group = await Group.aggregate([
      { $match: { GroupName } },
      {
        $lookup: {
          from: 'users',
          localField: 'Users',
          foreignField: '_id',
          as: 'groupUsers'
        }
      },
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
    const userId = new ObjectId(req.user._id);
    // console.log({ userId });


    const groups = await Group.aggregate([
      {
        $match: {
          Users: {
            $in: [
              userId
            ]
          }

        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createBy',
          foreignField: '_id',
          as: 'creator'
        }
      },
      { $unwind: '$creator' }
    ]);



    if (Object.keys(groups).length === 0) {
      return res.status(400).json({ msg: 'User you Not have any  Group' });
    }

    res.status(200).json({ groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
