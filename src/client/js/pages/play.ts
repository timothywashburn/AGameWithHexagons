import '../objects/game';
import '../controllers/connection';
import '../misc/ui'
import '../../../shared/packets/packet';
import { ToastMessage } from '../../../shared/enums';
import { showToast } from "../controllers/toast";
import { Modal } from "bootstrap";

(window as any).gameData = {}

window.onload = function() {
	if (!localStorage.token) return;

	fetch('/api/account', {
		method: 'GET',
		headers: {
			'Authorization': 'Bearer ' + localStorage.token
		}
	})
		.then(response => response.json())
		.then(data => {
			if (!data.success) return;

			if (data.info.email === null) {
				showToast(ToastMessage.NO_EMAIL_WARN.message, ToastMessage.NO_EMAIL_WARN.color);
			} else if(data.info.email_verified.data[0] === 0) {
				showToast(ToastMessage.UNVERIFIED_EMAIL_WARN.message, ToastMessage.UNVERIFIED_EMAIL_WARN.color);

			}
		})
		.catch(error => console.error('Error:', error));
}

export let devConfig;

function updateGames() {
	let headers = new Headers();
	headers.append("Authorization", "Bearer " + localStorage.token);

	let requestOptions: RequestInit = {
		method: 'GET',
		headers: headers as HeadersInit,
		redirect: 'follow'
	};

	fetch('/api/gamedata', requestOptions)
		.then((response) => response.json())
		.then((data) => {
			devConfig = data.dev;

			let lobbyContainer = document.getElementById('lobbyContainer');
			lobbyContainer.innerHTML = data.html;

			const gameCards = document.querySelectorAll('.gameLobby');
			gameCards.forEach((card) => {
				card.addEventListener('click', () => {
					const gameID = card.id;
					console.log('Clicked game ID:', gameID);

					joinGame(gameID, (window as any).gameData.socketID);
				});
			});

			if (!data.authenticated) {
				let modal = new Modal(document.getElementById('promptModal'))
				modal.show();
			}

			if (devConfig.autoJoin && !document.getElementById('promptModal').style.display) joinGame(0, (window as any).gameData.socketID);
		});
}

export function joinGame(game, socket) {
	let headers = new Headers();
	headers.append("Authorization", "Bearer " + localStorage.token);

	let requestOptions: RequestInit = {
		method: 'GET',
		headers: headers as HeadersInit,
		redirect: 'follow'
	};

	let url = '/api/join';
	let params = { game: game, socketID: socket };
	url += '?' + new URLSearchParams(params).toString();

	fetch(url, requestOptions)
		.then((response) => response.json())
		.then((data) => {
			if (!data.success) {
				if (data.alert) {
					window.alert(data.message);
				} else {
					console.error(data.message);
				}
			}
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