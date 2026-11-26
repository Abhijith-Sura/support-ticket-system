const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { seedDatabase } = require('./utils/seeder');

const runSeed = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.error('Cannot run seed script without a database connection.');
      process.exit(1);
    }

    await seedDatabase({ reset: true, quiet: false });
    console.log('Seed credentials:');
    console.log('  Admin -> admin@helpdesk.com / admin123');
    console.log('  User  -> user@helpdesk.com / user123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

runSeed();
