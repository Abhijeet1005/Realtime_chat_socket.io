// I know this is some bad DB code, will correct it later on
require('dotenv').config();
const UserModel = require('./model'); 
const mongoose = require('mongoose');

async function storeUser(user, hash) {
    try {
        // Connect to the MongoDB database 
        //This can be migrated to another file for connecting to DB instead of opening a connection on every call
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const newUser = new UserModel({ username: user, hash_password: hash });
        await newUser.save();
        console.log('User stored successfully');
    } catch (err) {
        console.error('Error storing user:', err);
    }
}

async function fetchUser(user) {
    try {
        // Connect to the MongoDB database
        //This can be migrated to another file for connecting to DB instead of opening a connection on every call

        await mongoose.connect(process.env.MONGODB_URI, {
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
