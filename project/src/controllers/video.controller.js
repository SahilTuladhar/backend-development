import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

// Video Controller Logic
// 1. Publish The Video 
// 2. getVideoByID
// 3. updateVideo
// 4. deleteVideo
// 5. 

// Publish Video Logic
// 1. Get Title and description from body 
// 2. Make use of Multer middleware to gain access to video local path 
// 3. Then use the local path to upload on Cloudinary 
// 4. Create a new video instance

const uploadVideo = asyncHandler(async(req,res) => {

    const {title , description} = req.body
     
    const userID = req.user._id

    if(!userID){
        throw new ApiError(403, "The User is not logged in ")
    }


    if(!title || title.trim() == ""){
        throw new ApiError(400, "Title for the Video is Missing")
    }

    if(!description || description.trim() == ""){
        throw new ApiError(400, "Description for the Video is Missing")
    }

    const videoLocalFilePath = req.files?.videoPath[0]?.path

    if(!videoLocalFilePath){
        throw new ApiError(401, "No Video File Provided")
    }

    const thumbnailLocalFilePath = req.files?.thumbnail[0]?.path

    if(!thumbnailLocalFilePath){
        throw new ApiError(401, "No Thumbnai File Provided")
    }

    const cloudVideoFile = await uploadOnCloudinary(videoLocalFilePath)
    const cloudThumbnailFile = await uploadOnCloudinary(thumbnailLocalFilePath)

    if(!cloudVideoFile){
        throw new ApiError(402, "Failed to Upload Video on Cloudinary")
    }
    
     if(!cloudThumbnailFile){
        throw new ApiError(402, "Failed to Upload thumbnail on Cloudinary")
    }

    // Creating new Video Instance

    const newVideo = await Video.create(
        {
         videoFile: cloudVideoFile.url,

         thumbnail: cloudThumbnailFile.url,

         owner: req.user._id,

         title: title,

         description: description,

         duration : cloudVideoFile.duration,

         views: 0, // intiially always set to 0

         isPublished: false // Draft mode concept so uploading is not publishing
         
        }   
    )
    
    // Checking if Video is created successfully
    const createdVideo = await Video.findById(newVideo._id)

    if(!createdVideo){
        throw new ApiError(403, "Failed to Create Video")
    }

    return res
    .status(201)
    .json(
       new ApiResponse(
            201,
            createdVideo,
            "Video has been Upload Successfully"
       )
    )
})

export {
    uploadVideo
}
