const mongoose = require('mongoose');

const projectObj = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'notesCollection'
};

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
  },
  labels: [String],
  projects: [projectObj]
}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);
