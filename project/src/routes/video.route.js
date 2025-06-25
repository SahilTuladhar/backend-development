import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { deleteVideo, getVideoByID, incrementViews, togglePublishStatus, updateVideo, uploadVideo } from "../controllers/video.controller.js";


const videoRouter = Router()

videoRouter.route('/publish-video').post(
    verifyJWT,
    upload.fields([
        {
            name:'videoPath',
            maxCount: 1
        },
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ]),
    uploadVideo 
)

videoRouter.route('/get-video/:videoID').get(
    getVideoByID
)

videoRouter.route('/update-video/:videoID').patch(
    upload.single('thumbnail'),
    updateVideo
)

videoRouter.route('/delete-video/:videoID').delete(
    deleteVideo
)

videoRouter.route("/toggle-publish-status/:videoID").patch(
    togglePublishStatus
)

videoRouter.route("/increment-views/:videoID").patch(
    verifyJWT,
    incrementViews
)

export default videoRouter