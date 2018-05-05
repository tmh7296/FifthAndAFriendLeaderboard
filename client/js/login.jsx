//React Component for rendering the login form on the home page
const RoomLoginComponent = props => {
	return (
		<div id="login">
			<h1 className="title">Fifth and a Friend Team Name</h1>
			<div id="toast"></div>
			<form id="roomLogin" name="roomLogin" action="/" onSubmit={joinRoom} method="POST">
				<label htmlFor="teamName">Team Name: </label>
				<input id="teamName" type="text" name="teamName" placeholder="Team Name" />
				<input className="submitForm button" type="submit" value="Enter" />
			</form>
		</div>
	);
};

//Renders the login form
const createRoomLogin = () => {
	ReactDOM.render(
		<RoomLoginComponent />,
		document.querySelector('#mainContent')
	);
};

//sets up events for the login page and renders the page
const setup = () => {
	createRoomLogin();
};