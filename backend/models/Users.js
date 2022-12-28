const mongoose = require('mongoose');

const projectsObj = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'projectsCollection'
};

const labelsObj = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'labelsCollection'
}

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
  verified:  { type: Boolean, default: false },
  profileImg: { type: String, trim: true, default: null },
  userTheme: { type: String, default: 'light' },
  projects: [projectsObj],
  labels: [labelsObj]
}, { collection: 'users' });

module.exports = mongoose.model('users', userSchema);
