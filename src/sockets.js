let io;

// lets the host know that it is the host
const confirmHost = (sock) => {
  const socket = sock;

  socket.isHost = true;
  socket.hostSocket = socket;

  socket.emit('hostConfirmation');
};

// Set up socketio events
const designateHost = (sock) => {
  const socket = sock;
	
  const socketRoom = io.sockets.adapter.rooms['room1'];

  if (!socketRoom || socketRoom.length === 0) {
    confirmHost(socket);
  } else {
    socket.isHost = false;
    const socketKeys = Object.keys(socketRoom.sockets);

    let hostFound = false;

    for (let i = 0; i < socketKeys.length; i++) {
      // grab the socket object from the overall socket list
      // based on the socket ids in the room
      const socketUser = io.sockets.connected[socketKeys[i]];

      // if this socket is the host and matches our room name
      if (socketUser.isHost) {
        // set the host socket reference as this socket's hostSocket (custom property)
        socket.hostSocket = socketUser;
        socket.emit('clientJoined');
        hostFound = true; // flag we did find a host (in case host left)
        socket.hostSocket.emit('userJoined', { name: socket.name });
        break; // stop searching for a host
      }
    }

    if (!hostFound) {
      confirmHost(socket);
    }
  }
};

// assign the user to a room
const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', (data) => {
    socket.join('room1');
		socket.name = data.name;
    designateHost(socket);
  });
};

//
const onClientSubmittedTime = (sock) => {
	const socket = sock;
	
	socket.on('clientSubmittedTime', data => {
		socket.hostSocket.emit('clientSubmittedTime', data);
	});
};

const setupSockets = (ioSever) => {
	io = ioSever;
	
	io.on('connection', sock => {
		const socket = sock;
		
		onJoined(socket);
		onClientSubmittedTime(socket);
	});
};

module.exports = {
  setupSockets,
};
