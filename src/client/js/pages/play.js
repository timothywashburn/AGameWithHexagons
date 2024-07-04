import '../game';
import '../controllers/connection';
import '../misc/ui'
import '../../../shared/packets/packet';

export let devConfig;

function updateGames() {
	let headers = new Headers();
	headers.append("Authorization", "Bearer " + localStorage.token);

	let requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};

	fetch('/api/gamedata', requestOptions)
		.then((response) => response.json())
		.then((data) => {
			let lobbyContainer = document.getElementById('lobbyContainer');
			lobbyContainer.innerHTML = data.html;

			if (!data.authenticated) {
				let modal = new bootstrap.Modal(document.getElementById('promptModal'))
				modal.show();
			}

			const gameCards = document.querySelectorAll('.gameLobby');

			gameCards.forEach((card) => {
				card.addEventListener('click', () => {
					const gameID = card.id;
					console.log('Clicked game ID:', gameID);

					joinGame(gameID, window.gameData.socketID);
				});
			});

			if (data.dev) {
				devConfig = data.dev;
				if (devConfig.autoJoin) {
					setTimeout(() => {
						joinGame(0, window.gameData.socketID);
					}, 200);
				}
			}
		});
}

function joinGame(game, socket) {
	let headers = new Headers();
	headers.append("Authorization", "Bearer " + localStorage.token);

	let requestOptions = {
		method: 'GET',
		headers: headers,
		redirect: 'follow'
	};

	let url = '/api/join';
	let params = { game: game, socketID: socket };
	url += '?' + new URLSearchParams(params).toString();

	fetch(url, requestOptions)
		.then((response) => response.json())
		.then((data) => {
			// TODO: Finish + figure out how to use data
		});
}

updateGames();

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
