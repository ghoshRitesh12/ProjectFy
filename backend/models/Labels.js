const mongoose = require('mongoose');

const collectionName = 'labelsCollection'

const labelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    trim: true 
  },
  color: { 
    type: String, 
    default: "hsl(0, 64%, 60%)" 
  }

}, { collection: collectionName });


module.exports = mongoose.model(collectionName, labelSchema);
