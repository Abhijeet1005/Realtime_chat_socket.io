const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const users = {"Abhijeet": "password"}; // This works as a temporary solution for storing registered users and will replace it with a DB with hashed passwords later on

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
  const username = req.body.username;
  const password = req.body.password;
  if(users[username] == password){
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
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chatmessage_return', msg);
  });
});

server.listen(3000,() => {
    console.log('Listening on port 3000');
});

