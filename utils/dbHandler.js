const UserModel = require('./model'); // Correctly import UserModel from models.js
const mongoose = require('mongoose');

async function storeUser(user, hash) {
    try {
        // Connect to the MongoDB database
        await mongoose.connect('mongodb://127.0.0.1:27017/chat?directConnection=true&serverSelectionTimeoutMS=2000', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const newUser = new UserModel({ username: user, hash_password: hash });
        await newUser.save();
        console.log('User stored successfully:');
    } catch (err) {
        console.error('Error storing user:', err);
    }
}

async function fetchUser(user) {
    try {
        // Connect to the MongoDB database
        await mongoose.connect('mongodb://127.0.0.1:27017/chat?directConnection=true&serverSelectionTimeoutMS=2000', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const userObject = await UserModel.findOne({ username: user });
        if (userObject) {
            return userObject;
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
}

module.exports = { storeUser, fetchUser };
