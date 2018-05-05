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
		teams[data.name] = "00:00:00";
		console.dir(teams);
		createTeamNameList();
	});
};

const onStartTimer = sock => {
	const socket = sock;

	socket.on('startTimer', () => {
		let sec = 0;
		const pad = ( val ) => { return val > 9 ? val : "0" + val; };
		console.dir("whatever");
		setInterval( function(){
			const seconds = pad(++sec%60);
			const minutes = pad(parseInt(sec/60,10));
			const hours = pad(parseInt(sec / 3600, 10));

			document.getElementById('timer').innerHTML = `${hours} : ${minutes} : ${seconds}`
		}, 1000);
	});
};

//host method for updating team times
const onClientSubmittedTime = sock => {
	const socket = sock;
	console.dir("bruh");
	socket.on('clientSubmittedTime', data => {
		if (data.time === "currTime") {
            teams[data.name] = document.getElementById('timer').innerHTML;
        }
		else{
			teams[data.name] = data.time;
		}
		createTeamNameList();
		socket.emit('submissionSuccess', { time: teams[data.name] });
	});
}

//sets up all of the host's socket events
const hostEvents = sock => {
	const socket = sock;
	
	onUserJoined(socket);
	onClientSubmittedTime(socket);
	onStartTimer(socket);
};