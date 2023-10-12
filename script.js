const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
// const { hashPassword } = require('./utils/helpers')

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


app.post('/login',(req,res) => {
  let Username = req.body.username;
  let password = req.body.password;

  if(users[Username] == password){
    
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


io.on('connection', (socket) => {
  socket.on('chat message', (message) => {
    message_list.push(message);
    io.emit('chatmessage_return', message_list);
  });
});

server.listen(3000,() => {
  console.log('Listening on port 3000');
});


