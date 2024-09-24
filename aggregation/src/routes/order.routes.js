const express = require('express')
const { HandlePost, HandleGet } = require('../controller/order.controller')
const router = express.Router()
const Order = require('../models/order.models')
router.route('/')
.get(HandleGet)
.post(HandlePost)

router.get('/OrderByDetail',async (req,res)=>{
    const lastMonth = new Date();

   console.log(lastMonth.getMonth());
   
    const newdate = `${lastMonth.getFullYear()}-${lastMonth.getMonth()}-${lastMonth.getDate()}`
    console.log(new Date(newdate));
    
    
    try {
      const orders = await Order.aggregate([
        {
          $match: {
            OrderDate: { $gte: new Date(newdate)},
            totalAmount: { $gte: 100 }
          }
        },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customerDetails'
          }
        },
        {
          $unwind: '$customerDetails'
        },
        {
          $project: {
            orderId: 1,
            totalAmount: 1,
            'customerDetails.name': 1,
            'customerDetails.email': 1
          }
        }
      ]);
      console.log(orders);
      
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
})




module.exports = router