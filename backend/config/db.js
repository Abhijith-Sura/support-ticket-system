const mongoose = require('mongoose');
const config = require('./config');

let memoryServer = null;

/**
 * Connect to MongoDB, with optional development fallback to mongodb-memory-server
 * when USE_MEMORY_DB=true or when local MongoDB is unavailable in development.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (config.useMemoryDb && config.nodeEnv !== 'production') {
    return connectMemoryDB();
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (config.nodeEnv === 'development') {
      console.warn('Attempting in-memory MongoDB fallback for local development...');
      const memConn = await connectMemoryDB();
      if (memConn) return memConn;
    }

    console.warn('Server will continue running without database connection.');
    return null;
  }
};

const connectMemoryDB = async () => {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`In-memory MongoDB started at ${uri}`);

    // Auto-seed demo dataset when starting a fresh in-memory dev database
    const User = require('../models/User');
    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      const { seedDatabase } = require('../utils/seeder');
      await seedDatabase({ reset: false, quiet: true });
      console.log('In-memory MongoDB seeded with demo users, tickets, comments, and activity logs.');
    }

    return conn;
  } catch (err) {
    console.error(`In-memory MongoDB fallback failed: ${err.message}`);
    return null;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
