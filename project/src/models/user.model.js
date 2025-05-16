
import mongoose , {Schema} from 'mongoose'
import { types } from 'util'

const userSchema = new Schema({
  username: {
    type: String,
    required: true, 
    lowercase: true,
    unique: true,
    trim: true,
    index: true

  } ,

  email: {
    type: String,
    required: true, 
    lowercase: true,
    unique: true,


  },

  fullName: {
    type: String,
    required: true, 
    lowercase: true,
    unique: true,
    index: true

  }, 

  watchHistory: [
    {
        type : Schema.Types.ObjectId,
        ref: 'Video'
    }
  ],
   
  avatar: {
    type: String, // from 3rd party
    required: true, 
  
  },

  coverImage: {
    type: String, // from 3rd party
  
  },

  password: {
    type: String,
    required: [true , 'Password is required']
  },

  refreshToken: {
    type: String
  }

} , {
    timestamps: true
})

export const User = mongoose.model('User' , userSchema)