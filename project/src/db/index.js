
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


// const asyncHandler = (requestHandler) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }