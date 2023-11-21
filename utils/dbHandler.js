const { UserModel, RoomModel } = require('./model');


async function storeUser(user, hash) {
    const newUser = new UserModel({ username: user, hash_password: hash });
        await newUser.save();
        console.log(`user ${user} stored successfully`);
}

async function addRoom(name){
    const roomCheck = await RoomModel.findOne({room_name: name});
    if(!roomCheck){
        const newRoom = new RoomModel({room_name: name, messages: []}) // This makes a new room when called and stores an empty array for messages
        await newRoom.save();
        console.log(`New room with ${name} as name created`) 
    }

}

async function fetchUser(user) {

    const userObject = await UserModel.findOne({ username: user });
    if (userObject) {
        return userObject;
    } else {
        return null;
    }

}

module.exports = { storeUser, fetchUser, addRoom };
