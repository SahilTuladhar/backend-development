import ApiError from '../utils/ApiErrors.js'
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import asyncHandler from '../utils/asyncHandler.js'


const verifyJWT = asyncHandler(async(req, res ,next) =>{

    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")


    if(!token){
        throw new ApiError(401, "UnAuthorized Request")
    }

    // verifying the token by decrypting it

    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
    )

    if(!user){
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user
    next()

})

export default verifyJWT