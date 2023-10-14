const mongoose = require('mongoose');

async function storeUser(user, hash) {
    // Will separate the connection logic later on
    mongoose.connect('mongodb://127.0.0.1:27017/chat?directConnection=true&serverSelectionTimeoutMS=2000', { useNewUrlParser: true, useUnifiedTopology: true });

    const UserSchema = new mongoose.Schema({
        username: String,
        hash_password: String,
    });
    const UserModel = mongoose.model('users', UserSchema);

    try {
        const newUser = await UserModel.create({ username: user, hash_password: hash });
        console.log('User stored successfully:');
    } catch (err) {
        console.error('Error storing user:', err);
    }
}

module.exports = { storeUser };

