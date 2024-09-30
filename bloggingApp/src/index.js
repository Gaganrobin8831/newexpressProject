require('dotenv').config()
const express = require('express')
const connectDB = require('./DB/database')
const path = require('path')
const router = require('./routes/user.routes')
const app = express()
const port = process.env.PORT
const cookiePaser = require('cookie-parser')



const blogRoute = require('./routes/blog.routes');

const {
    checkForAuthenticationCookie,
  } = require('./middlewares/authentication');
  
  
app.set('views', path.join(__dirname, 'views')); // Adjusted to point to src/views
app.set('view engine', 'ejs');
// app.set("view engine","ejs")
// app.set("views",path.resolve("./views"))
// Set the views directory to the correct path
// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
// Middleware to check for token on every request
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./src/public")));
// console.log(path.resolve("./src/public"));


app.use(router)
app.use("/blog", blogRoute);

connectDB()
.then(
    app.listen(port,()=>{
        console.log(`server is running on port http://localhost:${port}/`);
    })
)
.catch((err)=>{
    console.log(err);
    
})