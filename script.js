const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { PassThrough } = require('stream');
const io = new Server(server);
const { hashPassword, checkUser } = require('./utils/helpers')

const users = {}; // This works as a temporary solution for storing registered users and will replace it with a DB with hashed passwords later on

let message_list = [];

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

  if(user_check){
    
    res.redirect("chatpage");
    
  }
  else{
    res.render("Login", { errorMessage: "Authentication failed. Please try again." });
  }
  
});


app.get('/chatpage',(req,res) => {
    res.render("chatpage");
});


app.get('/signup',(req,res) => {
    res.render("signup");
});


app.post('/signup',(req,res) => {
    username = req.body.newUsername;
    Password = req.body.newPassword;
    confirmPassword = req.body.confirmPassword;

    if(Password == confirmPassword){
      hashPassword(Password,username);
      res.redirect('login');
    }
});


io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    message_list.push(message);
    io.emit('chatmessage_return', message_list);
  });
});

server.listen(3000,() => {
  console.log('Listening on port 3000');
});


