import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiErrors.js'
import asyncHandler from '../utils/asyncHandler.js'
import uploadOnCloudinary from '../utils/Cloudinary.js'
import ApiResponse from '../utils/ApiResponse.js'


const generateAccessAndRefreshTokens = async(userID) => {
   
   try{
      const user = await User.findById(userID)

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
   
      //storing the refreshToken in database
   
      user.refreshToken = refreshToken
   
      await user.save({ validateBeforeSave: false})
   
      return {accessToken , refreshToken}

   }catch(err){
     
      throw new ApiError(500, "Something went wrong while generating Tokens")
   }

   

}

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
   
   console.log('Hi,', fullName);
   console.log('Your Email is:', email);
   

   // validation code 

    const check_list = [fullName , email , username , password].map((field) => field?.trim() === "")
    
   if ( check_list.includes(true) ) {
     console.log('empty field detected');
     
     throw new ApiError(400, 'Missing entry fields expected')
      
   }

   const existedUser = await User.findOne({
    $or: [{username} , {email}]
   })

   if(existedUser){
    throw new ApiError(409 , 'User has with same username or email has already been registered')
   }

   // Checking for files present in the request

  const avatarLocalPath =  req.files?.avatar[0]?.path
  const coverImgLocalPath = req.files?.coverImage[0]?.path

  // check if avatar Exists

  if(!avatarLocalPath){
    throw new ApiError(401 , 'Avatar Does not exists')
  }
  
  // checking the path of the files uploaded
  console.log(avatarLocalPath);
  
  // uploading in cloudnary 

  const cloudAvatar = await uploadOnCloudinary(avatarLocalPath)
  const cloudCoverImg = await uploadOnCloudinary(coverImgLocalPath)

  console.log(req.files)
  

  if(!cloudAvatar) {
   throw new ApiError(400 , "Avatar not uploaded to cloudinary")
  }

  //creating an record and sending to database using User model
   const newUser = await User.create({
      fullName,
      avatar: cloudAvatar.url,
      coverImg: cloudCoverImg?.url || " " ,
      email,
      username: username.toLowerCase(),
      password

   })

   console.log('this is the user entered' , newUser);
   

    // check if the user has been created in the database

  
   const createdUser = await User.findById(newUser._id).select(
         "-password -refreshToken"
   )

   if (!createdUser){
      throw new ApiError(500 , 'User has not been registered in the database')
   }


   return res.status(201).json(

      new ApiResponse(200 , createdUser , "User Created Successfully"  )

   )


})


// take data from front end using req body
//  perform validationa on the input
// check if values exist in database - GET request
// check if the entered values acutally are mapped together in database
// Generate REFRESH TOKENS and ACCESS TOKENS 
//  - create a seperaete function
//   - finds the user and then generates tokens
//   - Returns the tokens
// send secure cookies and response



const loginUser = asyncHandler(async(req,res) => {

   // taking data

   const {email , username , password} = req.body

   if (!username && !email){
      throw new ApiError(400 , "Username or email is required")
   }

   if(!password){
      throw new ApiError(400 , "Password is required")
   }

   // finding the user in the database

   const user= await User.findOne({
      $or:[{username},{email}]
   })

   if(!user){
      throw new ApiError(404,'User does not Exist')
   }

   //checking for correct password
   // Note that the methods defined within the model is obtained from the instance of the record of the model instead of the mongoDB model instance

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
      throw new ApiError(401, "Password credientials not valid")
   }

   // Creating Access and Request Tokens -method technique

   const {refreshToken , accessToken} = await generateAccessAndRefreshTokens(user._id)

   // Passing the data back to the user- removing some unwanted fields
     // - accessing the user from the database again to reflect the refresh token
   
   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   // setting up config to send cookies

   const options = {
      httpOnly : true,
      secure: true
   }

   return res
   .status(200)
   .cookie("accessToken" , accessToken , options)
   .cookie("refreshToken", refreshToken , options)
   .json(
      new ApiResponse(
         200,
         {
            user: loggedInUser , refreshToken , accessToken
         },
         "User logged in successfully"
      )
   )
       
})

//Logout user
// 1. Create a middle ware to add user info to the incomming request
// - find user
// -clear out cookies
// - Clear out the refresh token to prevent re-accessing the account

const logoutUser = asyncHandler(async(req,res) => {

   //Clearing the refreshToken

   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken : undefined
         }
      },
      {
         new: true //provides the latest updated values
      }
   )

   // Clearing the cookies

    const options = {
      httpOnly : true,
      secure: true
   }

   res
   .status(201)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200,{}, "User Logged Out Successfully"))


})

export {registerUser , loginUser , logoutUser} 
