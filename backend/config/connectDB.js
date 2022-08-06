const mongoose = require('mongoose');

const connectDB = async DATABASE_URI => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log('Connected to DB');
    
  } catch (err) {
    console.log('Couldnt connect to the database');
  }
}

module.exports = connectDB;
