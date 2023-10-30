const mongoose = require('mongoose');
require('dotenv').config({ path: '../' });

const dbConnect = async function(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected")
      
      } catch (err) {
        console.error('Error connecting to DB', err);
      }
    
}

const UserSchema = new mongoose.Schema({
    username: String,
    hash_password: String,
    
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = {
    UserModel,
    dbConnect
  };