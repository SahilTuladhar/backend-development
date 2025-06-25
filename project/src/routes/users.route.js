
import {Router} from 'express'
import {registerUser , loginUser, logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage, getUserChannelProfile , getWatchHistory, getVideosUploaded} from '../controllers/users.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
import verifyJWT from '../middlewares/auth.middleware.js'
import { refreshAccessToken } from '../controllers/users.controller.js'

const userRouter = Router()

userRouter.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount : 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ])
    ,registerUser)
    
userRouter.route('/login').post(loginUser)

userRouter.route('/logout').post(
    verifyJWT,
    logoutUser)

userRouter.route('/refresh-access-token').post(refreshAccessToken)

userRouter.route('/change-password').post(verifyJWT, changeCurrentPassword)

userRouter.route('/get-current-user').post(verifyJWT , getCurrentUser)

userRouter.route('/update-account-details').patch(verifyJWT , updateAccountDetails)

userRouter.route('/update-avatar').patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
)

userRouter.route('/update-cover-image').patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
)

userRouter.route('/get-channel-profile/:username').get(
    getUserChannelProfile
)

userRouter.route('/get-watch-history').get(
    verifyJWT,
    getWatchHistory
)

userRouter.route('/get-videos-uploaded').get(
    verifyJWT,
    getVideosUploaded
)


export default userRouter 