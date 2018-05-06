//SECTION: React Components
const styles = {
	teams: {
		display: "flex",
		justifyContent: "center",
		border: "1px solid"
	},
	list: {
		width: "40%",
		display: "flex",
		justifyContent: "center"
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "center"
	}
};

const RankedTeamNameListItemComponent = props => {
	let items = [];

	Object.keys(props.teamNames).forEach(teamName => {
		if (props.teamNames[teamName] !== "00:00:00") {
			items.push(React.createElement(
				"li",
				null,
				`${teamName}: ${props.teamNames[teamName]}`
			));
		}
	});

	return items;
};

const TeamNameListItemComponent = props => {
	let items = [];

	Object.keys(props.teamNames).forEach(teamName => {
		items.push(React.createElement(
			"li",
			null,
			`${teamName}`
		));
	});

	return items;
};

const TeamNameListComponent = props => {
	return React.createElement(
		React.Fragment,
		null,
		React.createElement(
			"div",
			{ style: styles.list },
			React.createElement(
				"h2",
				null,
				"Joined Teams"
			),
			React.createElement(
				"ul",
				{ id: "joinedTeams" },
				React.createElement(TeamNameListItemComponent, { teamNames: teams })
			)
		),
		React.createElement(
			"div",
			{ style: styles.list },
			React.createElement(
				"h2",
				null,
				"Leaderboard"
			),
			React.createElement(
				"ul",
				{ id: "rankedTeams" },
				React.createElement(RankedTeamNameListItemComponent, { teamNames: teams })
			)
		)
	);
};

const HostPageComponent = props => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"div",
			{ id: "teamNames", style: styles.teams },
			React.createElement(TeamNameListComponent, null)
		),
		React.createElement(
			"div",
			{ style: styles.buttonContainer },
			React.createElement(
				"h1",
				{ id: "timer" },
				"00:00:00"
			),
			React.createElement(
				"button",
				{ id: "timerButton", onClick: hostStartTimer },
				"Start Timer"
			)
		)
	);
};

const ClientButtonComponent = props => {
	return React.createElement(
		"button",
		{ id: "submitTime", onClick: clientSubmitTime, type: "button", "class": "btn btn-danger btn-lg" },
		"Finished the Fifth!"
	);
};

const ClientConfirmationComponent = props => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"h1",
			null,
			"Congratulations on making it to the finish line!"
		),
		React.createElement(
			"button",
			{ onClick: clientRepealTime },
			"Take it back"
		)
	);
};

//SECTION: Methods for rendering components
let timer = null;

const hostStartTimer = () => {
	let sec = 0;
	if (document.getElementById('timerButton').innerHTML === "Start Timer") {
		document.getElementById('timerButton').innerHTML = "Stop Timer";
		timer = setInterval(function () {
			const pad = val => {
				return val > 9 ? val : "0" + val;
			};
			const seconds = pad(++sec % 60);
			const minutes = pad(parseInt(sec / 60, 10));
			const hours = pad(parseInt(sec / 3600, 10));

			document.getElementById('timer').innerHTML = `${hours}:${minutes}:${seconds}`;
		}, 1000);
	} else {
		clearInterval(timer);
		Object.keys(teams).forEach(v => teams[v] = "00:00:00");
		createTeamNameList();
		document.getElementById('timerButton').innerHTML = "Start Timer";
		document.getElementById('timer').innerHTML = "00:00:00";
	}
};

const createTeamNameList = () => {
	ReactDOM.render(React.createElement(TeamNameListComponent, null), document.querySelector('#teamNames'));
};

const createHostPage = () => {
	ReactDOM.render(React.createElement(HostPageComponent, null), document.querySelector('#mainContent'));
};

const createClientButton = () => {
	ReactDOM.render(React.createElement(ClientButtonComponent, null), document.querySelector('#mainContent'));
};

const createClientConfirmation = time => {
	ReactDOM.render(React.createElement(ClientConfirmationComponent, { time: time }), document.querySelector('#mainContent'));
};

const createHostOrClientPage = () => {
	if (isHost) {
		createHostPage();
	} else {
		createClientButton();
	}
};

const clientRepealTime = e => {
	socket.emit('clientSubmittedTime', { time: "00:00:00", name: teamName });

	createClientButton();
};

//SECTION: App logic
const clientSubmitTime = e => {
	e.preventDefault();
	socket.emit('clientSubmittedTime', { time: "currTime", name: teamName });
	socket.on('submittedTime', function (data) {
		console.log(data);
	});
	createClientConfirmation();
};
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
		const pad = val => {
			return val > 9 ? val : "0" + val;
		};
		console.dir("whatever");
		setInterval(function () {
			const seconds = pad(++sec % 60);
			const minutes = pad(parseInt(sec / 60, 10));
			const hours = pad(parseInt(sec / 3600, 10));

			document.getElementById('timer').innerHTML = `${hours} : ${minutes} : ${seconds}`;
		}, 1000);
	});
};

//host method for updating team times
const onClientSubmittedTime = sock => {
	const socket = sock;
	socket.on('clientSubmittedTime', data => {
		if (data.time === "currTime") {
			teams[data.name] = document.getElementById('timer').innerHTML;
		} else {
			teams[data.name] = data.time;
		}
		createTeamNameList();
		socket.emit('submittedTime', teams[data.name]);
	});
};

//sets up all of the host's socket events
const hostEvents = sock => {
	const socket = sock;

	onUserJoined(socket);
	onClientSubmittedTime(socket);
	onStartTimer(socket);
};
//React Component for rendering the login form on the home page
const RoomLoginComponent = props => {
	return React.createElement(
		"div",
		{ id: "login" },
		React.createElement(
			"h1",
			{ className: "title" },
			"Fifth and a Friend Team Name"
		),
		React.createElement("div", { id: "toast" }),
		React.createElement(
			"form",
			{ id: "roomLogin", name: "roomLogin", action: "/", onSubmit: joinRoom, method: "POST" },
			React.createElement(
				"label",
				{ htmlFor: "teamName" },
				"Team Name: "
			),
			React.createElement("input", { id: "teamName", type: "text", name: "teamName", placeholder: "Team Name" }),
			React.createElement("input", { className: "submitForm button", type: "submit", value: "Enter" })
		)
	);
};

//Renders the login form
const createRoomLogin = () => {
	ReactDOM.render(React.createElement(RoomLoginComponent, null), document.querySelector('#mainContent'));
};

//sets up events for the login page and renders the page
const setup = () => {
	createRoomLogin();
};
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
		socket.emit('join', { name: teamName });
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
