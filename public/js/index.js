var socket = io();
//sroll 
function scrollToBottom(){
    //selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight+scollTop +newMessageHeight+lastMessageHeight >= scrollHeight){
      messages.scrollTop(scrollHeight);
    }
};
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
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        text: message.text,
        from: message.from,
        createdAt: formatedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom()
});

//newLocationMessage
socket.on('newLocationMessage',function(message){
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formatedTime
       
    });
    jQuery('#messages').append(html);
    scrollToBottom()
  
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