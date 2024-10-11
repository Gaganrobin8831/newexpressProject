const express = require('express');
const path = require('path'); // Import the path module
const { HandleRegester, HandleLogin } = require('../controller/auth.controller');
const { checkAuth } = require('../middlewares/authentication');
const router = express.Router(); // Correctly initialize the router
const User = require('../models/user.models')
const Message = require('../models/message.models')


router.get('/', checkAuth,async (req, res) => {
    try {
        const AllUser = await User.find({})
        console.log(AllUser);
      
           // Construct the absolute path to the home.ejs file
    res.render(path.join(__dirname, '..', 'views', 'home.ejs'),{user:req.user ,alluser:AllUser}); // Go up one level to access the views folder

    } catch (error) {
        console.log(error);
        
    }
 
});
router.route('/regester').get((req,res)=>{
    res.render(path.join(__dirname, '..', 'views', 'regester.ejs'));
}).post(HandleRegester)


router.route('/Login').get((req,res)=>{
    const message = req.query.message || null; // Get message from query parameters or set to null
    res.render(path.join(__dirname, '..', 'views', 'Login.ejs'), { message });
}).post(HandleLogin)


router.get('/messages/:userId', checkAuth, async (req, res) => {
    const userId = req.params.userId;
    const loggedInUserId = req.user._id; // Assuming req.user is set after validating token

    const messages = await Message.find({
        $or: [
            { To: userId, From: loggedInUserId },
            { To: loggedInUserId, From: userId }
        ]
    });

    res.json(messages);
});

module.exports = router;
