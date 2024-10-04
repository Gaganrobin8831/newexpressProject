const mongoose = require('mongoose')



const connectDB = async ()=>{
    try {
        const connectionInstance =await  mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        console.log(`MONGO DB RUN ON !! ${connectionInstance.connection.host}`);
           
    } catch (error) {
        console.log("ERROR",error);
        process.exit(1)
    }
    
}

module.exports = connectDB