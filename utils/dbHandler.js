// I know this is some bad DB code, will correct it later on
// require('dotenv').config({ path: '../' });
const { UserModel } = require('./model');


async function storeUser(user, hash) {
    const newUser = new UserModel({ username: user, hash_password: hash });
        await newUser.save();
        console.log('User stored successfully');
}

async function fetchUser(user) {

    const userObject = await UserModel.findOne({ username: user });
    if (userObject) {
        return userObject;
    } else {
        return null;
    }

}

module.exports = { storeUser, fetchUser };
