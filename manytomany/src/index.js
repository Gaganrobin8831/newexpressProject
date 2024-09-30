require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./DB/database')
const router = require('./routes/user.routes')
const port = process.env.PORT
const cookieParser = require('cookie-parser')

app.use(router)
// app.use(express.urlencoded({extended:false}))
// app.use(express.json())
app.use(cookieParser)





connectDB()
.then(()=>{
    app.listen(port,()=>{
       console.log( `The port is run on http://localhost:${port}/`);
       
    })
})
.catch((err)=>{
    console.log(err);
    
})