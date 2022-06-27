let express = require('express');
let http = require('http');

let app = express();
let server = http.createServer(app);

let io = require('socket.io')(server);
let path = require('path');


app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


let name;

io.on('connection', (socket) => {
  console.log('new user connected');
  
  socket.on('user joined chat room', (username) => {
  	name = username;
  	io.emit('chat notification', `${name} joined the chat`);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat notification', `${name} left the chat`);
    
  });
  socket.on('chat notification', (msg) => {
    socket.broadcast.emit('chat notification', msg);         //sending message to all except the sender
  });
});

server.listen(3000, () => {
  console.log('Server listening on :3000');
});


