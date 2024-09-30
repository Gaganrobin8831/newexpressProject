const express = require('express')
const { HandlePost, HandleLogin } = require('../controllers/auth.controller')
const router = express.Router()

router.get('/',(req,res)=>{
    console.log("Hello User");
    
    res.send({msg:'Home'})
})
router.get('/register',HandlePost)
router.get('/Login',HandleLogin)

module.exports = router