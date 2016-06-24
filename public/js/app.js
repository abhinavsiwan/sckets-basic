//making a connection to the server via socket
var socket = io();

socket.on('connect', function () {
	console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
	console.log("New Message received from server");
	console.log(message.text);
});