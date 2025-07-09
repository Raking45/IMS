'use strict';

const mongoose = require('mongoose');
const config = require('./config');

const connectToDatabase = async () => {
  try {
    console.log('Connecting to MongoDB with Mongoose...');
    await mongoose.connect(config.dbUrl, {
  
    });
    console.log('Mongoose connected to MongoDB');
  } catch (err) {
    console.error('Mongoose connection error:', err);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectToDatabase;