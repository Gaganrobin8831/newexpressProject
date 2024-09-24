const Customer = require('../models/custmor.models')
const Order = require('../models/order.models')


async function HandlePost(req, res) {
        const { name, email, phone,orderDate, totalAmount } = req.body;
        const lastMonth = new Date(orderDate);
        
         const newdate = `${lastMonth.getFullYear()}-${lastMonth.getMonth()+1}-${lastMonth.getDate()}`
         console.log(new Date(newdate));
        try {
          //create custmor-----------------------------
            const newCustomer = new Customer({
                name,
                email,
                phone
            });
            const savedCustomer = await newCustomer.save();
          //------------------------------------------------- 
            // console.log(savedCustomer);
            
          // create order --------------------------------------------
            const newOrder = new Order({
                customerId: savedCustomer._id,
                orderDate: new Date(newdate),
                totalAmount
            });
            const savedOrder = await newOrder.save();
            console.log(savedOrder);
            
        //------------------------------------------------------
        // console.log("You Are here");
        
            res.status(201).json({
                message: 'Order and Customer created successfully',
                order: savedOrder,
                customer: savedCustomer
            });
        } catch (err) {
           
            res.status(500).json({ error: err.message });
        }


}
async function HandleGet(req,res) {
    try {
        const orders = await Order.aggregate([
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
        
        
        res.json(orders);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}
async function HandleTodayMonthGet(req,res) {
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
}

module.exports = {
    HandlePost,
    HandleGet,
    HandleTodayMonthGet
}