//SECTION: React Components
const TeamNameListItemComponent = props => {
	let items = [];
	
	Object.keys(props.teamNames).forEach(teamName => {
		items.push(<li>{`${teamName}: ${props.teamNames[teamName]}`}</li>)
	});
	
	return items;
};

const TeamNameListComponent = props => {
	return (
		<div>
			<ul>
				<TeamNameListItemComponent teamNames={teams} />
			</ul>
		</div>
	);
};

const HostPageComponent = props => {
	return (
		<div>
			<div id="teamNames">
				<TeamNameListComponent />
			</div>
            <span id="timer">
				00:00:00
            </span>
            <button id="timerButton" onClick={hostStartTimer}>Start Timer</button>
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
		<div>
			<h1>Your team finished your Fifth in {`${props.time}`}</h1>
			<button onClick={clientRepealTime}>Take it back</button>
		</div>
	);
};

//SECTION: Methods for rendering components
let timer = null;

const hostStartTimer = () => {
    let sec = 0;
    if (document.getElementById('timerButton').innerHTML  === "Start Timer"){
        document.getElementById('timerButton').innerHTML = "Stop Timer";
        timer = setInterval( function(){
            const pad = ( val ) => { return val > 9 ? val : "0" + val; };
            const seconds = pad(++sec%60);
            const minutes = pad(parseInt(sec/60,10));
            const hours = pad(parseInt(sec / 3600, 10));

            document.getElementById('timer').innerHTML = `${hours}:${minutes}:${seconds}`
        }, 1000);
	}
	else {
		clearInterval(timer);
        Object.keys(teams).forEach(v => teams[v] = "00:00:00");
        createTeamNameList();
		document.getElementById('timerButton').innerHTML = "Start Timer";
		document.getElementById('timer').innerHTML = "00:00:00";
	}
};

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
};

const clientRepealTime = e => {
	socket.emit('clientSubmittedTime', {time: "00:00:00", name: teamName});

	createClientButton();
};

//SECTION: App logic
const clientSubmitTime = e => {
	e.preventDefault();
	socket.emit('clientSubmittedTime', {time: "currTime", name: teamName});
	socket.on('submissionSuccess', function(data){
		console.log("something");
		const timestamp = data.time;
        createClientConfirmation(timestamp);
	});
};