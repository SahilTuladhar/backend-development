
import mongoose from "mongoose";
import { DB_NAME } from '../constants.js';



const connectDB = async () => {

    try{

    const dbConnectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    console.log(`\n MongoDB connection established!! DB HOST: ${dbConnectionInstance.connection.host}`);
    

    }catch(err){

        console.log("ERR: Database connection Failed:" , err);
        process.exit(1)
        
    }

}

export default connectDB