const express = require('express');
const path = require('path'); // Import the path module
const router = express.Router(); // Correctly initialize the router

router.get('/', (req, res) => {
    // Construct the absolute path to the home.ejs file
    res.render(path.join(__dirname, '..', 'views', 'home.ejs')); // Go up one level to access the views folder
});
router.route('/regester').get((req,res)=>{
    res.render(path.join(__dirname, '..', 'views', 'regester.ejs'));
})
module.exports = router;
