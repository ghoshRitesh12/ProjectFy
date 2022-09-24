const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    immutable: true,
    unique: true
  },
  uuid: {
    type: String,
    trim: true,
    required: true,
    minLength: 27,
    immutable: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  refreshToken : {
    type: String, 
    trim: true,
    default: ""
  },
  verified:  {
    type: Boolean,
    default: false
  },
  userTheme: {
    type: String,
    default: 'light'
  }
}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);
