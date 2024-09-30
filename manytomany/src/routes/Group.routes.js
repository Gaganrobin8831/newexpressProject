const express = require('express');
const Group = require('../models/Goups.models');
const authenticate = require('../middleware/authentication');
const authorize = require('../middleware/authorize');
const router = express.Router();
const User = require('../models/user.models');

router.get('/create', authenticate, async (req, res) => {
  try {
   const {GroupName,createBy,Users} = req.query;
   console.log(req.user._id);
   
   console.log({GroupName,createBy,Users});
   const isExitUser = await User.findOne({name:Users})
//    console.log(isExitUser);
   
   if(!isExitUser) {return res.status(400).json({msg:"User is not exits"})}
   
   const groupMember= await Group.updateOne(
    {GroupName,createBy:req.user._id},
    {$push:{Users:isExitUser._id}},
    {upsert:true}
   )

   console.log(groupMember);
   
    
    res.status(201).json({ message: 'Group created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/:groupId/join', authenticate, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }
    res.status(200).json({ message: 'Joined group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get('/:groupId', authenticate,  async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (req.user._id !== group.createBy) {
      return res.status(403).json({ message: 'Only the creator or an admin can delete this group' });
    }
    // await group.remove();
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
