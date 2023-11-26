require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { hashPassword, checkUser } = require('./utils/helpers')
const CryptoJS = require('crypto-js');
const { fetchUser,addRoom } = require('./utils/dbHandler');
const { UserModel, RoomModel } = require('./utils/model');
const session = require('express-session');
const cookie = require('cookie-parser');
const cookieParser = require('cookie-parser');
let secret = process.env.SECRETKEY

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

const dbConnect = async function(){ 
  try {
      await mongoose.connect(process.env.MONGODBURI);
      console.log("DB connected")
    
    } catch (err) {
      console.error('Error connecting to DB', err);
    }
  
}
let room = 'main' //this decided the room being used for the chat from the server side on initial connect

dbConnect()
addRoom(room)


app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static('./public'));
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
      res.cookie({"roomInUse": 'main'})  //creates a deault room cookie for every socket connection(when it .get()s the chatpage)
      
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


io.on('connection', async (socket) => {
  // Retrieve existing messages from the database
  const fetchedRoom = await RoomModel.findOne({ room_name: room });
  const messages = fetchedRoom.messages;

  // Send existing messages to the connected user
  socket.emit('chatmessage_return', messages);

  // Handle new chat messages
  socket.on('chat message', async (message) => {
    // Save the new message to the database
    fetchedRoom.messages.push(message);
    fetchedRoom.save();

    // Broadcast the new message to all connected clients
    io.emit('chatmessage_return', fetchedRoom.messages);
  });
});



server.listen(process.env.PORT,() => {
  console.log(`Listening on port ${process.env.PORT}`);
});