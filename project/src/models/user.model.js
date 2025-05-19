
import mongoose , {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcr ypt'
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

userSchama.pre('save' , async function(next) {
  if(!this.modified('password')) return

  this.password = bcrypt.hash(this.password , 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
   
  return await bcrypt.compare(password , this.password)
}
 
userSchema.methods.generateAccessToken = function () {
  return jwt.sign( 
    
    // Payload return 
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName
    },
    // Secret Key
    process.env.ACCESS_TOKEN_SECRET,

    //Expiry time
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }

  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign( 
    
    // Payload return 
    {
      _id: this._id,
     
    },
    // Secret Key
    process.env.REFRESH_TOKEN_SECRET,

    //Expiry time
    {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }

  )
}


export const User = mongoose.model('User' , userSchema)