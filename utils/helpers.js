const bcrypt = require('bcryptjs');
const { storeUser } = require('./dbHandler');

const saltRounds = 10;
const users = {}; // This works as a temporary solution for storing registered users and will replace it with a DB with hashed passwords later on


//Will be called when a new user signs up and the password needs to be hashed and stored in the database
function hashPassword(plain_password,username) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plain_password, salt, async function(err, hash) {
            // users[username] = hash;
            await storeUser(username,hash);
        });
    });
}




//Will be callled when the user logs in and the entered password need to be checked
async function checkUser(username, password) {
    if (users[username]) {
      const hashPassword = users[username];
      const match = await bcrypt.compare(password, hashPassword);
      
      return match;
    } else {
      return false; // If the user doesnt exist
    }
  }

module.exports = {
    hashPassword,checkUser
}