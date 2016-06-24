var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' wants to join ' + room);
//making a connection to the server via socket
var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	var timeStamp = message.timestamp;
	var momentTimeStamp = moment.utc(timeStamp).local().format('h:mm a');

	var $message = jQuery('.messages')
	console.log("New Message received from server");
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' ' + momentTimeStamp + '</strong></p>');
	$message.append('<p>' +message.text + '</p>');
});

//Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	//it prevents the form to be submitted the old fashioned way
	//i.e refreshing the entire page
	event.preventDefault();

	var $message = $form.find('input[name=message]');

	socket.emit('message', {
		name: name,
		text: $message.val()
	});

	$message.val('');
});