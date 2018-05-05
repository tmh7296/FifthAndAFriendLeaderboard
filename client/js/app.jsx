//SECTION: React Components
const TeameNameListItemComponent = props => {
	let items = [];
	
	Object.keys(props.teamNames).forEach(teamName => {
		items.push(<li>{`${teamName}: ${props.teamNames[teamName]}`}</li>)
	});
	
	return items;
};

const TeamNameListComponent = props => {
	return (
		<ul>
			<TeameNameListItemComponent teamNames={teams} />
		</ul>
	);
};

const HostPageComponent = props => {
	return (
		<div>
			<div id="teamNames">
				<TeamNameListComponent />
			</div>
		</div>
	);
};

const ClientButtonComponent = props => {
	return (
		<button id="submitTime" onClick={clientSubmitTime}>Finished the Fifth!</button>
	);
};

const ClientConfirmationComponent = props => {
	return (
		<h1>Your team finished your Fifth in {`${props.time}`}</h1>
	);
};

//SECTION: Methods for rendering components
const createTeamNameList = () => {
	ReactDOM.render(
		<TeamNameListComponent />,
		document.querySelector('#teamNames')
	);
};

const createHostPage = () => {
	ReactDOM.render(
		<HostPageComponent />,
		document.querySelector('#mainContent')
	)
};

const createClientButton = () => {
	ReactDOM.render(
		<ClientButtonComponent />,
		document.querySelector('#mainContent')
	);
};

const createClientConfirmation = time => {
	ReactDOM.render(
		<ClientConfirmationComponent time={time} />,
		document.querySelector('#mainContent')
	);
};

const createHostOrClientPage = () => {
	if (isHost) {
		createHostPage();
	} else {
		createClientButton();
	}
}

//SECTION: App logic
const clientSubmitTime = e => {
	e.preventDefault();
	
	const timestamp = new Date();
	
	socket.emit('clientSubmittedTime', {time: timestamp, name: teamName});
	
	createClientConfirmation(timestamp);
};