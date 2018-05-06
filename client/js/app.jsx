//SECTION: React Components
const styles = {
	teams : {
    	display: "flex",
    	justifyContent: "center",
		border: "1px solid"
	},
	list : {
		width: "80%",
		display: "flex",
		justifyContent: "center"
	},
	buttonContainer : {
		display:"flex",
		justifyContent: "center"
	}
};

const RankedTeamNameListItemComponent = props => {
	let items = [];
	
	Object.keys(props.teamNames).forEach(teamName => {
		if (props.teamNames[teamName] !== "00:00:00"){
            items.push(<li>{`${teamName}: ${props.teamNames[teamName]}`}</li>)
		}

	});
	
	return items;
};

const TeamNameListItemComponent = props => {
    let items = [];

    Object.keys(props.teamNames).forEach(teamName => {
    	items.push(<li>{`${teamName}`}</li>)
    });

    return items;
};

const TeamNameListComponent = props => {
	return (
		<React.Fragment>
			<div style={styles.list}>
				<h2>Joined Teams</h2>
				<ul id="joinedTeams">
					<TeamNameListItemComponent teamNames={teams} />
				</ul>
			</div>
			<div style={styles.list}>
				<h2>Leaderboard</h2>
				<ul id="rankedTeams">
					<RankedTeamNameListItemComponent teamNames={teams}/>
				</ul>
			</div>
		</React.Fragment>
	);
};

const HostPageComponent = props => {
	return (
		<div>
			<div id="teamNames" >
				<TeamNameListComponent />
			</div>
            <div style={styles.buttonContainer}>
				<h1 id="timer">
					00:00:00
				</h1>
            	<button id="timerButton" onClick={hostStartTimer}>Start Timer</button>
			</div>
		</div>
	);
};

const ClientButtonComponent = props => {
	return (
		<button id="submitTime" onClick={clientSubmitTime} type="button" class="btn btn-danger">Finished the Fifth!</button>
	);
};

const ClientConfirmationComponent = props => {
	return (
		<div>
			{/*<h1>Your team finished your Fifth in {`${props.time}`}</h1>*/}
			<h1>Congratulations on making it to the finish line!</h1>
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
    socket.on('submittedTime', function(data){
        console.log(data);
    });
	createClientConfirmation();
};