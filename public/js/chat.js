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
   
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
         window.location.href = '/';
        }else{
          console.log('no error in user login');
        }
    });
    
});

//listen for event emitted by server
socket.on('disconnect',function(){
    console.log('disconnected from server');
});

socket.on('updateUserList', function(usersList){
    var ol = jQuery('<ol></ol>');
    usersList.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
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