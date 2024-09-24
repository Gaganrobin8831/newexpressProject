const Customer = require('../models/custmor.models')
const Order = require('../models/order.models')


async function HandlePost(req, res) {
        const { name, email, phone,orderDate, totalAmount } = req.body;

        try {
          //create custmor-----------------------------
            const newCustomer = new Customer({
                name,
                email,
                phone
            });
            const savedCustomer = await newCustomer.save();
          //------------------------------------------------- 
            
          // create order --------------------------------------------
            const newOrder = new Order({
                customerId: savedCustomer._id,
                orderDate: new Date(orderDate),
                totalAmount
            });
            const savedOrder = await newOrder.save();
        //------------------------------------------------------
        console.log("You Are here");
        
            res.status(201).json({
                message: 'Order and Customer created successfully',
                order: savedOrder,
                customer: savedCustomer
            });
        } catch (err) {
           
            res.status(500).json({ error: err.message });
        }


}

module.exports = {
    HandlePost
}