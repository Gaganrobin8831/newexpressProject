const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const mongoose = require('mongoose');
// Fetch orders with customer details


router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: 'customerId',
          as: 'customerDetails'
        }
      },
      {
        $unwind: '$customerDetails' // Flatten the customer details array
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
});


// Fetch orders filtered by date and amount
router.get('/orders/filtered', async (req, res) => {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: lastMonth },
          totalAmount: { $gt: 100 }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: 'customerId',
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
});





// POST: Create both customer and order in one request
router.post('/orders/create', async (req, res) => {
    const { name, email, phone, orderId, orderDate, totalAmount } = req.body;
    // Start a session for transaction (optional for rollback purposes)
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Step 1: Create a new customer
      const newCustomer = new Customer({
        customerId: new mongoose.Types.ObjectId(),
        name,
        email,
        phone
      });
      const savedCustomer = await newCustomer.save({ session });
      // Step 2: Create a new order with the newly created customer ID
      const newOrder = new Order({
        orderId,
        customerId: savedCustomer.customerId,
        orderDate: new Date(orderDate),
        totalAmount
      });
      const savedOrder = await newOrder.save({ session });
      // Commit transaction if everything is fine
      await session.commitTransaction();
      session.endSession();
      // Return the saved data
      res.status(201).json({
        message: 'Order and Customer created successfully',
        order: savedOrder,
        customer: savedCustomer
      });
    } catch (err) {
      // Abort transaction in case of an error
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: err.message });
    }
  });
  








module.exports = router;






