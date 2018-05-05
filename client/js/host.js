let teams = {};

//once the host is confirmed, add to users object
const hostConfirmation = data => {
	isHost = true;
	alert('you are host');
	//render app page
};

//host method for receiving request from the client to get initial queue info
const onUserJoined = sock => {
	const socket = sock;
	
	socket.on('userJoined', data => {
		teams[data.name] = 0;
		console.dir(teams);
		createTeamNameList();
	});
};

//host method for updating team times
const onClientSubmittedTime = sock => {
	const socket = sock;
	
	socket.on('clientSubmittedTime', data => {
		teams[data.name] = data.time;
		createTeamNameList();
	});
}

//sets up all of the host's socket events
const hostEvents = sock => {
	const socket = sock;
	
	onUserJoined(socket);
	onClientSubmittedTime(socket);
};