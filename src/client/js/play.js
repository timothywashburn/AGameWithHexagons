import { startGame } from "./game";

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

			if(window.devMode) {
				setTimeout(() => {
					joinGame(0, window.socketID);
				}, 200);
			}
		});
}

function joinGame(lobby, socket) {
	let url = '/api/join';
	let params = { lobby: lobby, socketId: socket };
	url += '?' + new URLSearchParams(params).toString();


	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			console.log(data.message);

			setTimeout(function(){
				if(window.devMode) {
					document.getElementById('chatBox').style.display = "none"
					document.getElementById('playerList').style.display = "none"
				}
			}, 5)
		});
}

updateLobbies();

export function showCanvas() {
	const lobbyDiv = document.getElementById('lobby');
	const gameDiv = document.getElementById('game');

	lobbyDiv.style.display = 'none';
	gameDiv.style.display = 'block';

	let canvas = document.getElementById("gameCanvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	})

	console.log(window.devMode);
	if(!window.devMode) new bootstrap.Modal(document.getElementById('usernameModal')).show();

	startGame();
}