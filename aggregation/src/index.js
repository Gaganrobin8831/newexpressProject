require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./DB/database')
const customerRoute = require('./routes/customer.routes')
const OrderRoute = require('./routes/order.routes')
const port = process.env.port



app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.use('/',customerRoute)
app.use('/order',OrderRoute)


connectDB()
.then(
    app.listen(port,()=>{
        console.log(`server is running on port http://localhost:${port}/`);
    })
)
.catch((err)=>{
    console.log(err)
})