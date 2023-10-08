const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.set("view engine","ejs");
app.use(express.static('./public'));

app.get('/',(req,res) => {
    res.render("auth");
});
app.post('/',(req,res) => {
  res.sendStatus(500);
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

