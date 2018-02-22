const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var server = http.createServer(app);//
var io = socketIO(server);//


app.use(express.static(publicPath));//
io.on('connection',(socket)=>{
console.log('new user connected!');
socket.on('disconnect',() =>{
console.log('User was disconnected!');
});

//emit
socket.emit('newMessage',{
    from: 'Admin',
    text: 'Welcome to the chat app',
    createAt: new Date().getTime()
});

//broadcast  
socket.broadcast.emit('newMessage',{
    from: 'Admin',
    text: 'New user joined...',
    createAt: new Date().getTime()
});

//listen for event emitted by client
socket.on('createMessage',(message) =>{
    console.log('createMessage event emitted from client',message);
   //io emit 
   io.emit('newMessage',{
    from: message.from,
    text: message.text,
    createdAt: new Date().getTime()
});

});
});

//listen
server.listen(port,function(){//
    console.log(`server is up on port ${port}`);
});