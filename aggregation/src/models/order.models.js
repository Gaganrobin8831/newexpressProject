const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    orderDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        default: 0,
        required: true
    }
}, { timeseries: true })

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order