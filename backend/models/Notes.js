const mongoose = require('mongoose');

const collectionName = 'notesCollection';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled",
    trim: true
  },
  note: {
    type: String,
    default: "Note",
    trim: true
  },
  userId: {
    type: String,
    trim: true,
    immutable: true,
    unique: true
  }
}, { collection: collectionName });


module.exports = mongoose.model(collectionName, noteSchema);
