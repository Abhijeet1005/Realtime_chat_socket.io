require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { hashPassword, checkUser } = require('./utils/helpers')
const { dbConnect } = require('./utils/model')
const CryptoJS = require('crypto-js');
const { fetchUser,getMessages,addRoom } = require('./utils/dbHandler');
let secret = process.env.SECRET_KEY

// Encryption function
function encryptText(text, secretKey) {
  const encryptedText = CryptoJS.AES.encrypt(text, secretKey).toString();
  return encryptedText;
}

// Decryption function
function decryptText(encryptedText, secretKey) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}

let messages_fetch = async function() {
  try {
    // Await the result of the getMessages function
    let roomData = await getMessages('main');
    
    return roomData.messages; 
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

let message_list = messages_fetch();



app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.use(express.static('./public'));

dbConnect()

app.get('/',(req,res) => {
    res.render("auth");
});


app.get('/login',(req,res) => {
    res.render("Login",{errorMessage: ''});
});


app.post('/login',async (req,res) => {
  let Username = req.body.username;
  let password = req.body.password;
  const user_check = await checkUser(Username,password) // awaits for the checkUser to verify credentials
  let encUser = encodeURIComponent(encryptText(Username,secret));

  if(user_check){
    console.log("User found and authenticated");
    res.redirect(`chatpage/${encUser}`);
    
  }
  else{
    res.render("Login", { errorMessage: "Authentication failed. Please try again." });
  }
  
});


app.get('/chatpage/:username', (req, res) => {
  let passedEncUser = req.params.username;
  let passedUser = decryptText(decodeURIComponent(passedEncUser), secret);
  if (!passedUser) {
    res.redirect('../login');
  } else {
    if (fetchUser(passedUser) != null) {
      res.render("chatpage", { user: passedUser });
    } else {
      res.redirect('../login');
    }
  }
});


app.get('/signup',(req,res) => {
    res.render("signup", {errorMessage: ''});
});


app.post('/signup', async (req, res) => {
  let username = req.body.newUsername;
  let Password = req.body.newPassword;
  let confirmPassword = req.body.confirmPassword;


  if(await fetchUser(username) != null){
    res.render('signup',{errorMessage: "User already exists, try another username"});
  }else{

    if (Password == confirmPassword) {
      hashPassword(Password, username); // Wait for the password hashing to complete
      res.redirect('login');
    } else {
        res.render('signup', { errorMessage: "Passwords do not match!" });
    }
  }
  

});



io.on('connection',(socket) => {
  
  socket.on('chat message', (message) => {
    
    message_list.push(message);
    io.emit('chatmessage_return', message_list);
  });
});

server.listen(process.env.PORT,() => {
  console.log(`Listening on port ${process.env.PORT}`);
});