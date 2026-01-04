const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './backend/.env' });

const updateUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Note: Using findOneAndUpdate to ensure we get the doc even if role is missing
        const user = await User.findOneAndUpdate(
            { email: 'okizmanofficial@gmail.com' },
            { $set: { role: 'tenant' } },
            { new: true }
        );

        if (user) {
            console.log('User updated:', user.email);
            console.log('New Role:', user.role);
        } else {
            console.log('User not found');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateUser();
