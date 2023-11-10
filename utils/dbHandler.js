// require('dotenv').config({ path: '../' });
const { UserModel, RoomModel } = require('./model');


async function storeUser(user, hash) {
    const newUser = new UserModel({ username: user, hash_password: hash });
        await newUser.save();
        console.log(`user ${user} stored successfully`);
}

async function addRoom(name){
    const roomCheck = await getMessages(name);
    if(!roomCheck){
        const newRoom = new RoomModel({room_name: name, messages: []}) // This makes a new room when called and stores an empty array for messages
        await newRoom.save();
        console.log(`New room with ${name} as name created`) 
    }

}

async function getMessages(Rname){
    const roomData = await RoomModel.findOne({ room_name: Rname });
    return roomData.messages;
    
}

async function fetchUser(user) {

    const userObject = await UserModel.findOne({ username: user });
    if (userObject) {
        return userObject;
    } else {
        return null;
    }

}

module.exports = { storeUser, fetchUser, addRoom, getMessages };
