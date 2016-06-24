var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

var clientInfo = {};
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	console.log('User conected via socket.io');

	//code to join private rooms
	socket.on('joinRoom' , function (req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined',
			timestamp: now.valueOf()
		});
	});
	//make two browsers communicate to each other
	//listen to messages from the client
	socket.on('message', function (message) {
		console.log('Message received:' + message.text);

		message.timestamp = now.valueOf();
		//io.emit() -> send the message to everyone including sender
		//sends the message to everyone except the sender
		//socket.broadcast.emit('message', message);
		//io.emit('message', message);
		io.to(clientInfo[socket.id].room).emit('message', message);
	});

	//timeStamp property - Javascript timestamp(miliseconds)
	var unixTimeStamp = now.valueOf();
	//send message to the client
	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat applcation!',
		timestamp: unixTimeStamp
	});
});

http.listen(PORT, function () {
	console.log('Server started');
})