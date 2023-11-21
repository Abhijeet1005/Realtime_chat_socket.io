const mongoose = require('mongoose');
require('dotenv').config({ path: '../' });

// const dbConnect = async function(){
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("DB connected")
      
//       } catch (err) {
//         console.error('Error connecting to DB', err);
//       }
    
// }

const RoomSchema = new mongoose.Schema({
  room_name: String,
  messages: [String],
})

const UserSchema = new mongoose.Schema({
    username: String,
    hash_password: String,
    
});

const RoomModel = mongoose.model('rooms',RoomSchema);  //collection for creating rooms, no need for now but will be needed in future when we need to make rooms through app
const UserModel = mongoose.model('users', UserSchema);

module.exports = {
    UserModel,
    RoomModel,
  };