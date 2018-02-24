const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage,generateLocationMessage} = require('./utils/message');

var app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var server = http.createServer(app);//
var io = socketIO(server);//


app.use(express.static(publicPath));//
io.on('connection',(socket)=>{
console.log('new user connected!');

//emit
socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

//broadcast  
socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

//listen for event emitted by client
socket.on('createMessage',(message,callback) =>{
    console.log('createMessage event emitted from client',message);
   //io emit 
   io.emit('newMessage',generateMessage(message.from,message.text));
   callback();

});
socket.on('createLocationMessage',(coords) =>{
 io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
});

socket.on('disconnect',() =>{
    console.log('User was disconnected!');
    });
});

//listen
server.listen(port,function(){//
    console.log(`server is up on port ${port}`);
});