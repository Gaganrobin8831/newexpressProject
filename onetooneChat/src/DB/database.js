const mongoose = require('mongoose')

const connctDBforChat =async ()=>{
    try {
        const connectionFordb = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        console.log(`MONGO DB RUN ON !! ${connectionFordb.connection.host}`);
        
        
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

module.exports = connctDBforChat