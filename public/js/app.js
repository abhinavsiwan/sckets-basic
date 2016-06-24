//making a connection to the server via socket
var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	console.log("New Message received from server");
	console.log(message.text);
});

//Handles submitting of new message
var $form = jQuery('#message-form');

$form.on('submit', function (event) {
	//it prevents the form to be submitted the old fashioned way
	//i.e refreshing the entire page
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	socket.emit('message', {
		text: $message.val()
	});

	$message.val('');
});