import { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";

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

// Get Video By ID Logic
// 1. get id from params
// 2. use ID to find the video from video collection 
// 3. Return the details

const getVideoByID = asyncHandler(async(req , res ) => {

    const {videoID } = req.params

    if(!isValidObjectId(videoID)){
        throw new ApiError(400 , "Invalid Video ID")
    }

    const video = await Video.findById(videoID)

    if(!video){
        throw new ApiError(401, "Video Not Found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        video,
        "Video Details Successfully Obtained"
    ))


})

const updateVideo = asyncHandler(async(req,res) => {

    let deleteRes = null

    const {videoID} = req.params

    const {title, description} = req.body

    const newThumbnailLocalPath = req.file?.path

    if(!isValidObjectId(videoID)){
        throw new ApiError(400, "Invalid Video ID")
    }

    if(!newThumbnailLocalPath){
        throw new ApiError(400 , "New Thumbnail not received")
    }

    const cloudinaryVideo = await uploadOnCloudinary(newThumbnailLocalPath)

    if(!cloudinaryVideo){
        throw new ApiError(401, "Failed to Upload Thumbnail on Cloudinary")
    }
    
    const exisitingVideo = await Video.findById(videoID)

    if(exisitingVideo.thumbnail){
      deleteRes =  await deleteFromCloudinary(exisitingVideo.thumbnail)
    }


    const updatedVideo = await Video.findByIdAndUpdate(
        videoID,
        {
            $set:{
              
                title: title,
                description: description,
                thumbnail : cloudinaryVideo.url

            }
        },
        {
            new:true, // Creates a new updated record
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {updatedVideo , deleteRes},
        "Video Updated Successfully"
    ))

})

const deleteVideo = asyncHandler(async(req,res) => {
    const {videoID} = req.params

    if(!isValidObjectId(videoID)){
        throw new ApiError(400, "Invalid Video ID")
    }

   const deletedVideo =  await Video.findByIdAndDelete(videoID)

   if(!deletedVideo){
    throw new ApiError(404, "Video not Successfully deleted")
   }

   return res
   .status(200)
   .json(new ApiResponse(
    200,
    deletedVideo,
    "Video Deleted Successfully"
   ))


})

const togglePublishStatus = asyncHandler(async(req,res) => {

     const {videoID} = req.params

     if(!isValidObjectId(videoID)){
        throw new ApiError(400, "Invalid Video ID")
    }

    const currentVideo = await Video.findById(videoID)

    if(!currentVideo){
        throw new ApiError(401, "Video not found")
    }

   const updatedStatus = await Video.findByIdAndUpdate(
    videoID,
    {
        $set : {
            isPublished : !currentVideo.isPublished
        }
    },
    { new: true }
);

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        updatedStatus,
        "Video Published Status Toggeled Successfully"
    ))


})

const incrementViews = asyncHandler(async(req,res) => {
     
    const {videoID} = req.params

    const userID = req.user?._id

    if(!isValidObjectId(videoID)){
        throw new ApiError(400 , 'Video ID invalid')
    }

    
    const currentVideo = await Video.findById(videoID)

    if(!currentVideo){
        throw new ApiError(401, "Video not found")
    }

    // const updatedVideo = await Video.findByIdAndUpdate(
    //     videoID,
    //     {
    //         $set:{
    //             views : currentVideo.views + 1
    //         }
    //     },
    //     {
    //         new : true
    //     }
    // )

    currentVideo.views += 1

    if(!currentVideo.viewers.includes(userID)){
        currentVideo.viewers.push(userID)
    }

    await currentVideo.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            currentVideo,
            "Video Views Incremented Successfully"
        )
    )


})

export {
    uploadVideo,
    getVideoByID,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    incrementViews
}
