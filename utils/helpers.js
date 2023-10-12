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
// function checkPassword(username, password, callback) {
//     bcrypt.compare(password, users[username], function (err, result) {
//         if (err) {
//             // Handle any potential errors (e.g., bcrypt error)
//             callback(err, false);
//         } else {
//             // Compare the result and invoke the callback
//             callback(null, true);
//         }
//     });
// }




module.exports = {
    hashPassword,
}