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

//listen for event emitted by client
socket.on('createMessage',(message) =>{
    console.log('createMessage event emitted from client',message);
});
//newMessage 
socket.emit('newMessage',{
 from: 'baz',
 text: 'hi, foo',
 createdAt: 1234
});
});

server.listen(port,function(){//
    console.log(`server is up on port ${port}`);
});