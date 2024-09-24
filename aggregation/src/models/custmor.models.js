const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,

    }
    ,
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phone: {
        type: Number,
        required: true

    }
}, { timeseries: true })

const Customer = mongoose.model('Customer', CustomerSchema)

module.exports = Customer