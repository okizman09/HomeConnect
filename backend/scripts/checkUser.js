const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './backend/.env' });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const email = 'okizmanofficial@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:');
            console.log(JSON.stringify(user.toObject(), null, 2));
            console.log('Role field:', user.role);
        } else {
            console.log('User not found');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUser();
