import dotenv from 'dotenv'
dotenv.config({
    path:'./env'
})


import connectDB from "./db/index.js";
import app from './app.js';
import { error } from 'console';



connectDB()
.then(() => {

app.on('error' , (err) => {

    console.log('ERR:' , err);
    throw err
    

})

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server sucessfully running at port ${process.env.PORT}`);
    
})
})
.catch((err) => {
    console.log("MongoDB connection Failed :" , err);
    
})