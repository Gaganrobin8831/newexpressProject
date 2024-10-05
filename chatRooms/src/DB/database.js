const mongoose = require('mongoose')

const connectDBrooms = async ()=>{
    try {
        const newConnctionInstance = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        console.log(`MONGO DB CONNECT ON !! ${newConnctionInstance.connection.host}`)
    } catch (error) {
        console.log(`MONGO ERROR !! ${error}`);
        process.exit(1);
        
    }
}

module.exports = connectDBrooms