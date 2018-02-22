var socket = io();
socket.on('connect',function(){
    console.log('connected to server!');
});
//listen for event emitted by server
socket.on('disconnect',function(){
    console.log('disconnected from server');
});

//custom events
//createEmail event
socket.emit('createMessage',{
    from: 'foo',
    text: 'hi , baz.'
});

socket.on('newMessage',function(message){
    console.log('newMessage',message);
});