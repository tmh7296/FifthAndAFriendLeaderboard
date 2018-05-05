//SECTION: React Components
const TeameNameListItemComponent = props => {
	let items = [];

	Object.keys(props.teamNames).forEach(teamName => {
		items.push(React.createElement(
			"li",
			null,
			`${teamName}: ${props.teamNames[teamName]}`
		));
	});

	return items;
};

const TeamNameListComponent = props => {
	return React.createElement(
		"ul",
		null,
		React.createElement(TeameNameListItemComponent, { teamNames: teams })
	);
};

const HostPageComponent = props => {
	return React.createElement(
		"div",
		null,
		React.createElement(
			"div",
			{ id: "teamNames" },
			React.createElement(TeamNameListComponent, null)
		)
	);
};

const ClientButtonComponent = props => {
	return React.createElement(
		"button",
		{ id: "submitTime", onClick: clientSubmitTime },
		"Finished the Fifth!"
	);
};

const ClientConfirmationComponent = props => {
	return React.createElement(
		"h1",
		null,
		"Your team finished your Fifth in ",
		`${props.time}`
	);
};

//SECTION: Methods for rendering components
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

//SECTION: App logic
const clientSubmitTime = e => {
	e.preventDefault();

	const timestamp = new Date();

	socket.emit('clientSubmittedTime', { time: timestamp, name: teamName });

	createClientConfirmation(timestamp);
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
};

//sets up all of the host's socket events
const hostEvents = sock => {
	const socket = sock;

	onUserJoined(socket);
	onClientSubmittedTime(socket);
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
