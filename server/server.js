const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');  

var app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var server = http.createServer(app);//
var io = socketIO(server);//
var users = new Users();

app.use(express.static(publicPath));//
io.on('connection',(socket)=>{
console.log('new user connected!');


socket.on('join',(params,callback) =>{
if(!isRealString(params.name) || !isRealString(params.room)){
   return callback('Name and room name are required.');
}
socket.join(params.room);
users.removeUser();
users.addUser(socket.id, params.name, params.room);

io.to(params.room).emit('updateUserList', users.getUserList(params.room));
socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

//broadcast  
socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));
callback();
});

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
   var user =  users.removeUser(socket.id);
   if(users){
    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
}
    });
   
});

//listen
server.listen(port,function(){//
    console.log(`server is up on port ${port}`);
});