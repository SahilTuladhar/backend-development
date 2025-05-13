import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username field Empty'],
    unique: [true, 'Username Already Exsits'],
  },

  email: {
    type: String,
    required: [true, 'Email field Empty'],
    unique: [true, 'Email already Registered'],
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minLength: [6, 'Password must have atleast 6 characters'],
  },
});

export const User = mongoose.model('User', userSchema);
