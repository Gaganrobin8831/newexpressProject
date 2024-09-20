const express = require('express')
const router = express.Router()
const {HandleReg,HandleLogin} = require('../controller/user.controller')

router.post('/',HandleReg)
router.post('/Login',HandleLogin)

module.exports = router