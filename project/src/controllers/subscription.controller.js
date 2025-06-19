import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiErrors.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Subscription Controller Logic
// 1. Subscribe to channel 
// 2. Unsubscribe from a channel
// 3. getting a list of subsribers
// 4. getting a list of channels subscribed to



// Subsribe Logic
// 1. get the channel data from params and user data from body 
// 2. check if params correctly given 
// 3. check if user logged in 
// 4. check if Channel exists
// 5. check if already subscribed to channel 
// 6. create an subscription instance and save it to database

const subscribeToChannel = asyncHandler(async(req , res) => {

 const {channelName} = req.params
 const userID = req.user._id

  
 if(!channelName){
    throw new ApiError(400, "Params Value not properly provided")
 }

 if(!userID){
    throw new ApiError(401, "Not Logged In ")
 }

 const channel = await User.findOne({
    username : channelName
 })

 if(!channel){
    throw new ApiError(402 , "The Channel Does not exist")
 }

 const isSubscribed = await Subscription.findOne({
    subscriber: userID,
    channel: channel._id
 })

 if(isSubscribed){
    throw new ApiError(404 , "Already Subscribed to the channel")
 }

 const newSubscription = await Subscription.create({
    subscriber: userID,
    channel: channel._id
 }) 


return res
.status(200)
.json(
new ApiResponse(
    200,
    newSubscription,
    "New Subscription has been added to the Database"

)
)
 
})

//UnSubscribe Logic
// 1. get the channel data from params and user data from body 
// 2. check if params correctly given

const unsubscribeToChannel = asyncHandler(async(req,res) => {

    const {channelName} =  req.params
    const userID = req.user._id 

     if(!channelName){
    throw new ApiError(400, "Params Value not properly provided")
    }

    if(!userID){
        throw new ApiError(401, "Not Logged In ")
    }

    const channel = await User.findOne(
        {username : channelName}
    )

    const isSubscribed = await Subscription.findOneAndDelete ({
        channel: channel._id,
        subscriber: userID
    })

    if(!isSubscribed){
        throw new ApiError(403, "You are not subscribed to this channel")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {success: true},
            "You have been unsubscribed from the channel"
        )
    )

})

//Get Subs
// 1. using params get access of the channelName
// 2. Validate params
// 3. access the channel user
// 3. use MongoDB pipeline : match -> lookup (based on channel)->project

const getSubscribers = asyncHandler(async(req, res) => {

    const {channelName} = req.params

    if(!channelName){
        throw new ApiError(400, 'Params Value not properly provided')
    }

    const channel = await User.aggregate([
        {
            $match:{
                username : channelName.toLowerCase()
            }
        },
        {
            

            $lookup:{
                from:'subscriptions',
                localField: '_id',
                foreignField: 'channel',
                as:'subscribers'
            }
        },
        {
            $addFields : {
                subscriberCount : {$size : '$subscribers'},
                subscriberIDs : {
                    $map:{
                        input: '$subscribers',
                        as:'sub',
                        in:'$$sub.subscriber'
                    }
                }
            }
        },
        {
            $project:{
                username : 1,
                subscriberCount : 1,
                subscriberIDs : 1
            }
        }
    ])

     // Fixed: Check if array is empty
    if(!channel || channel.length === 0){
        throw new ApiError(404, "Channel does not exist")
    }
    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            channel,
            "Channel Subscribers Retrieved Successfully"
        )
    )

    
  
})



export {
    subscribeToChannel,
    unsubscribeToChannel,
    getSubscribers
}