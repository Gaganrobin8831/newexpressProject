const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

const connectDB = require('./DB/database')
const router = require('./routes/user.routes')
const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use('/',router)

connectDB()
.then(()=>{
   
    
    app.listen(port,()=>{
        console.log(`server is running on port http://localhost:${port}/`);
    })
})
.catch((err)=>{
    console.log(err)
})
