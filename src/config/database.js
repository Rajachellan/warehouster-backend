const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MongoDB connection failed: ${error.message}`);
    console.log('Attempting connection to local MongoDB fallback...');
    try {
      const fallbackUri = 'mongodb://127.0.0.1:27017/warehouster';
      const conn = await mongoose.connect(fallbackUri);
      console.log(`MongoDB connected to fallback: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.error('MongoDB connection error (primary and fallback both failed):', fallbackError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
