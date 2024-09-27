const mongoose = require('mongoose')

const connectDB = async ()=>{
 try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
 } catch (error) {
    console.log(error);
    process.exit(1)
    
 }
  
}

module.exports = connectDB