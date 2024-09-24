const express = require('express')
const { HandlePost } = require('../controller/order.controller')
const router = express.Router()

router.route('/')
.get((req, res) => {
    res.send('here is order')
})
.post(HandlePost)


module.exports = router