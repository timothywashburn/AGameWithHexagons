import { startGame } from "../game";

export let devConfig;

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

			if (data.dev) {
				devConfig = data.dev;
				if (devConfig.autoJoin) {
					setTimeout(() => {
						joinGame(0, window.socketID);
					}, 200);
				}
			}
		});
}

function joinGame(lobby, socket) {
	let headers = new Headers();
	headers.append("Authorization", "Bearer " + localStorage.token);

	let requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};

	let url = '/api/join';
	let params = { lobby: lobby, socketId: socket };
	url += '?' + new URLSearchParams(params).toString();

	fetch(url, requestOptions)
		.then((response) => response.json())
		.then((data) => {
			window.authenticated = data.authenticated;
			showCanvas();

			setTimeout(function(){
				if(devConfig) {
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

	if(!window.authenticated) {
		let modal = new bootstrap.Modal(document.getElementById('promptModal'))
		if(!window.devMode) modal.show();
	}

	startGame();
}

document.getElementById('guestBtn').addEventListener('click', function() {
	let modal = document.getElementById('promptModal');
	modal.classList.remove('show');
	modal.style.display = 'none';

	let backdrops = document.getElementsByClassName('modal-backdrop');
	for (let i = 0; i < backdrops.length; i++) {
		backdrops[i].parentNode.removeChild(backdrops[i]);
	}
});

document.getElementById('registerBtn').addEventListener('click', function() {
	window.location.href = '/register';
});

document.getElementById('loginBtn').addEventListener('click', function() {
	window.location.href = '/login';
});