function updateLobbies() {
	fetch('/api/lobbydata')
		.then((response) => response.json())
		.then((data) => {
			let lobbyContainer = document.getElementById('lobbyContainer');
			lobbyContainer.innerHTML = data.html;

			const lobbyCards = document.querySelectorAll('.lobby');

			lobbyCards.forEach((card) => {
				card.addEventListener('click', () => {
					const lobbyID = card.id;
					console.log('Clicked lobby ID:', lobbyID);

					joinGame(lobbyID, window.socketID);
				});
			});
		});
}

function joinGame(lobby, socket) {
	let url = '/api/join';
	let params = { lobby: lobby, socketId: socket };
	url += '?' + new URLSearchParams(params).toString();

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			console.log('testing');
			console.log(data);
		});
}

updateLobbies();

function showCanvas() {
	console.log('showing canvas');
	alert("You have joined a game!");
	// let canvas = document.getElementById('gameCanvas');
	// canvas.style.display = 'block';
	// canvas.height = window.innerHeight;
	// canvas.width = window.innerWidth;
	//
	// let ctx = canvas.getContext("2d");
	//
	// ctx.fillStyle = "blue";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

}
