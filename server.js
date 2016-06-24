var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

var clientInfo = {};
app.use(express.static(__dirname + '/public'));

// Sends current users to provided socket
function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		timestamp: now.valueOf()
	});
}

io.on('connection', function(socket) {
	console.log('User conected via socket.io');

	//code to leave or disconnect from private rooms
	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id]
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left the room',
				timestamp: now.valueOf()
			});
			//delete the client info
			delete clientInfo[socket.id];
		}
	});

	//code to join private rooms
	socket.on('joinRoom', function(req) {
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
	socket.on('message', function(message) {
		console.log('Message received:' + message.text);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = now.valueOf();
			//socket.broadcast.emit('message', message);
			//io.emit('message', message);
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
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

http.listen(PORT, function() {
	console.log('Server started');
})