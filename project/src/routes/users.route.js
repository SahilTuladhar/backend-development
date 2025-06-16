
import {Router} from 'express'
import {registerUser , loginUser, logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage} from '../controllers/users.controller.js'
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

userRouter.route('/update-account-details').post(verifyJWT , updateAccountDetails)

userRouter.route('/update-avatar').post(
    upload.single("avatar"),
    verifyJWT,
    updateAvatar
)


userRouter.route('/update-cover-image').post(
    upload.single("coverImage"),
    verifyJWT,
    updateCoverImage
)


export default userRouter 