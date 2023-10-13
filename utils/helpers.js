const bcrypt = require('bcryptjs');
const saltRounds = 10;
const users = {}; 


//Will be called when a new user signs up and the password needs to be hashed and stored in the database
function hashPassword(plain_password,username) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plain_password, salt, function(err, hash) {
            users[username] = hash;
            console.log("Hashed and stored");
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