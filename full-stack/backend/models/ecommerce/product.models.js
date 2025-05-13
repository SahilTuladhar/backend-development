import mongoose from "mongoose";
import { type } from "node:os";

const productSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    productImage: {
        type: String,
    },

    price: {
        type:Number,
        required: true,
        default: 0
    },

    stock: {
        type: Number,
        required: true,
        default: 0
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }





} , {timestamps: true})

export const Product = mongoose.model('Product' , productSchema)