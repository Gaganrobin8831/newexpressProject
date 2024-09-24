const express = require('express')
const { HandlePost, HandleGet, HandleTodayMonthGet } = require('../controller/order.controller')
const router = express.Router()
const Order = require('../models/order.models')
router.route('/')
.get(HandleGet)
.post(HandlePost)

router.get('/OrderByDetail',HandleTodayMonthGet)




module.exports = router