import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {getSubscribers, subscribeToChannel, unsubscribeToChannel} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.route('/subscribe/:channelName').post(
    verifyJWT,
    subscribeToChannel
)

subscriptionRouter.route('/unsubscribe/:channelName').post(
    verifyJWT,
    unsubscribeToChannel
)

subscriptionRouter.route('/get-channel-subscribers/:channelName').get(
    getSubscribers
)

export default subscriptionRouter