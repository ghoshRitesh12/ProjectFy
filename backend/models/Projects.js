const mongoose = require('mongoose');
const collectionName = 'projectsCollection';

const projectSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  projectOverview: {
    name: { type: String, required: true, trim: true },
    startDate: { type: Date, default: Date.now() },
    endDate: { type: Date },
    goals: { type: String, trim: true }
  },
  projectIdea: {
    date: { type: String },
    description: { type: String, required: true, trim: true },
    imgUrl: { type: String, trim: true },
    imgUpload: { type: String, trim: true },
    isImgAUrl: { type: Boolean, default: true }
  },
  projectKanban: {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    labels: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      color: {
        type: String,
        default: "#ff7575"
      }
    }]
  }
}, { collection: collectionName });

module.exports = mongoose.model(collectionName, projectSchema);
