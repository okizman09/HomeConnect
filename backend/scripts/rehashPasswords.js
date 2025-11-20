const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

async function rehashPasswords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.collection.find({}).toArray();
    console.log(`Found ${users.length} users to process`);

    for (const user of users) {
      // Check if password looks like it was hashed (bcrypt hashes start with $2)
      if (user.password && !user.password.startsWith('$2')) {
        console.log(`Rehashing password for user: ${user.email}`);
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        await User.collection.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        console.log(`✓ Updated password for ${user.email}`);
      } else if (user.password && user.password.startsWith('$2')) {
        console.log(`✓ Password already hashed for ${user.email}`);
      } else {
        console.log(`⚠ No password found for ${user.email}`);
      }
    }

    console.log('Password rehashing complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during rehashing:', error);
    process.exit(1);
  }
}

rehashPasswords();
