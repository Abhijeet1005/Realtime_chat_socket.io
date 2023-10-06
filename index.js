const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/templates/index.html')
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

