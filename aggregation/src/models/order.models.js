const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    customorID: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer'
    },
    OrderDate: {
        type: Date,
        default: Date.now

    },
    totalAmount: {
        type: Number,
        default: 0,
        required: true
    }
}, { timeseries: true })

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order