const mongoose = require('mongoose');
const collectionName = 'projectsCollection';

const labelsObj = {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'users'
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
    category: { type: String, required: true },
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    labels: [labelsObj]
  }
}, { collection: collectionName });

// test Schema
// const projectSchema = new mongoose.Schema({
//   createdBy: {
//     type: String,
//     required: true,
//     trim: true,
//     default: 'Rg'
//   },
//   isPublic: {
//     type: Boolean,
//     default: false
//   },
//   projectOverview: {
//     name: { type: String, required: true, trim: true, default: 'testProject1' },
//     startDate: { type: Date, default: Date.now() },
//     endDate: { type: Date, default: Date.now() },
//     goals: { type: String, trim: true, default: 'My goals are beyond ur understanding' }
//   },
//   projectIdea: {
//     date: { type: String, default: Date.now() },
//     description: { type: String, required: true, trim: true, default: 'a sample description' },
//     imgUrl: { type: String, trim: true, default: 'www.gogle.co.op' },
//     imgUpload: { type: String, trim: true },
//     isImgAUrl: { type: Boolean, default: true }
//   },
//   projectKanban: {
//     category: { type: String, default: 'inProgress' },
//     title: { type: String, trim: true, default: 'kanbani about "page" bruh' },
//     description: { type: String, trim: true },
//     labels: [labelsObj]
//   }
// }, { collection: collectionName });

module.exports = mongoose.model(collectionName, projectSchema);
