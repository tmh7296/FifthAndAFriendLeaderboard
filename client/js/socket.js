let isHost = false;
let socket;
let teamName = '';

const joinRoom = e => {
	e.preventDefault();
	
	teamName = document.querySelector('#teamName').value;
	
	if (teamName === '') {
		alert('You must enter a team name');
		return false;
	}
	
	socket = io.connect();
	
	socket.on('connect', () => {
		socket.emit('join', {name: teamName});
	});
	
	//only fires if this socket is the host
  //initializes all of the host's websocket events
  socket.on('hostConfirmation', () => {
    hostConfirmation();
    //set up all our host methods
    hostEvents(socket);
		createHostOrClientPage();
  });
	
	socket.on('clientJoined', () => {
		console.log('client joined');
		createHostOrClientPage();
	});
};

//Renders the initial login screen
setup();