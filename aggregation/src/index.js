require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./DB/database')

const port = process.env.port

connectDB()
.then(
    app.listen(port,()=>{
        console.log(`server is running on port http://localhost:${port}/`);
    })
)
.catch((err)=>{
    console.log(err)
})