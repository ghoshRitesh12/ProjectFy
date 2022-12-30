const mongoose = require('mongoose');
const collectionName = 'projectsCollection';

const labelsObj = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'labelsCollection'
};

// actual schema
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
    startDate: { type: String },
    endDate: { type: String },
    goals: { type: String, trim: true, default: '' },
    completedTasks: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 }
  },
  projectIdeas: [{
    date: { type: String },
    description: { type: String, trim: true },
    imgUrl: { type: String, trim: true, default: null },
    imgUpload: { type: String, trim: true, default: null },
    isImgAUrl: { type: Boolean, default: true },
    hostedImgId: { type: String, default: null }
  }],
  projectKanban: [{
    id: { type: String, },
    category: { type: String },
    title: { type: String, trim: true, default: null },
    description: { type: String, trim: true, default: null },
    labels: [labelsObj]
  }]
}, { collection: collectionName });


module.exports = mongoose.model(collectionName, projectSchema);
