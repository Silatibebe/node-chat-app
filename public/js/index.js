var socket = io();
socket.on('connect',function(){
    console.log('connected to server!');
    
});
//listen for event emitted by server
socket.on('disconnect',function(){
    console.log('disconnected from server');
});

//newMessage
socket.on('newMessage',function(message){
    var formatedTime = moment(message.createdAt).format('h:mm a');
    console.log('newMessage',message);
    var li = jQuery('<li></>');
    li.text(`${message.from}: ${formatedTime}: ${message.text}`);
    jQuery('#messages').append(li);
});

//newLocationMessage
socket.on('newLocationMessage',function(message){
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location </a>');
    li.text(`${message.from}: ${formatedTime} `);
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
});
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    var messageTexbox = jQuery('[name=message]');
   socket.emit('createMessage',{
       from: 'User',
       text: messageTexbox.val()
   },function(){
     messageTexbox.val('');
   });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){return alert('Geolocation not supported by your browser');
}
locationButton.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('send location');//remove button disable
    socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    });
    },function(){
    locationButton.removeAttr('disabled').text('send location');
    alert('unable to fetch location.');
    });
});