const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        const connectionInstamce = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        console.log(`MONGO DB CONNECT AT !! ${connectionInstamce.connection.host}`);
        
        
    } catch (error) {
        console.log("ERROR : ",error)
        throw error
    }
}

module.exports = connectDB