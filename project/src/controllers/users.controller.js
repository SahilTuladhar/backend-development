import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiErrors.js'
import asyncHandler from '../utils/asyncHandler.js'

const registerUser = asyncHandler( async(req, res) => {
    
   // take data from the frontend 
   // perform validation that is required
   // upload to cloudinary, the images and check for images that returns an URL 
   // create a user Object to store it in MongoDb
   // create entry in the database 
   // remove password and email from response provided by the storing in the database
   // check for error creation 
   // if success then return response 

   // req.body gains takes data from frontend that is sent from form or as a JSON format

   const {fullName , email , username , password} = req.body 

   // validation code 

    const check_list = [fullName , email , username , password].map((field) => field?.trim() === "")
    
   if ( check_list.includes(true) ) {
     console.log('empty field detected');
     
     throw new ApiError(500 , 'Missing entry fields expected')
     
   }

   const existedUser = await User.findOne({
    $or: [{username} , {email}]
   })

   if(existedUser){
    throw new ApiError(409 , 'User has with same username or email has already been registered')
   }

   console.log("email:" , email);
   


})

const loginUser = asyncHandler( async(req , res) => {

 res.status(201).json({
    message : "User Logged In"
 })

})

export {registerUser , loginUser} 
