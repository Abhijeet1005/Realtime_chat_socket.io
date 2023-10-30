require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { hashPassword, checkUser } = require('./utils/helpers')
const { dbConnect } = require('./utils/model')


let message_list = []; //This can be replaced to store the messages in DB and fetch them on reloads

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

  if(user_check){
    console.log("User found and authenticated");
    res.redirect(`chatpage/${Username}`);
    
  }
  else{
    res.render("Login", { errorMessage: "Authentication failed. Please try again." });
  }
  
});


app.get('/chatpage/:username',(req,res) => {
  let passeduser = req.params.username;
  if(!passeduser){
    res.redirect('login',{ errorMessage: "Wrong User" })
  }
  res.render("chatpage",{user : passeduser});
});


app.get('/signup',(req,res) => {
    res.render("signup", {errorMessage: ''});
});


app.post('/signup', async (req, res) => {
  username = req.body.newUsername;
  Password = req.body.newPassword;
  confirmPassword = req.body.confirmPassword;

  if (Password == confirmPassword) {
      await hashPassword(Password, username); // Wait for the password hashing to complete
      res.redirect('login');
  } else {
      res.render('signup', { errorMessage: "Passwords do not match!" });
  }
});



io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    message_list.push(message);
    io.emit('chatmessage_return', message_list);
  });
});

server.listen(process.env.PORT,() => {
  console.log(`Listening on port ${process.env.PORT}`);
});


