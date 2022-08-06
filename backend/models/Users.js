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
    immutable: true
  },
  uuid: {
    type: String,
    trim: true,
    required: true,
    minLength: 30,
    immutable: true
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
  }
}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);