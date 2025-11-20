const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function deleteAllUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    const result = await User.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} users`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteAllUsers();
