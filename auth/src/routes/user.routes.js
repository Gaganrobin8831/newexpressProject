const express = require('express')
const router = express.Router()
const { HandleReg, HandleLogin } = require('../controller/user.controller')
const { forgetPassword, resetPass } = require('../controller/forget.controller')

router.post('/', HandleReg)
router.post('/Login', HandleLogin)
router.post('/forget-pasword', forgetPassword)
router.get('/reset-pasword', resetPass)

module.exports = router