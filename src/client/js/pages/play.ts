import '../objects/client-game';
import '../controllers/connection';
import '../controllers/ui-overlay';
import '../../../shared/packets/base/packet';
import { showToast } from '../controllers/toast';
import { Modal } from 'bootstrap';
import Enum from '../../../shared/enums/enum';

(window as any).gameData = {};

window.onload = function () {
	if (!localStorage.token) return;

	fetch('/api/account', {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + localStorage.token
		}
	})
		.then((response) => response.json())
		.then((data) => {
			if (!data.success) return;

			if (data.info.email === null) {
				showToast(Enum.AccountToastMessage.NO_EMAIL_WARN.message, Enum.AccountToastMessage.NO_EMAIL_WARN.color);
			} else if (data.info.email_verified.data[0] === 0) {
				showToast(
					Enum.AccountToastMessage.UNVERIFIED_EMAIL_WARN.message,
					Enum.AccountToastMessage.UNVERIFIED_EMAIL_WARN.color
				);
			}
		})
		.catch((error) => console.error(error));
};

export interface DevConfig {
	autoJoin: boolean;
	hideChat: boolean;
	hidePlayerList: boolean;
}

export let devConfig: DevConfig;

function updateGames() {
	let headers = new Headers();
	headers.append('Authorization', 'Bearer ' + localStorage.token);

	let requestOptions: RequestInit = {
		method: 'GET',
		headers: headers as HeadersInit,
		redirect: 'follow'
	};

	fetch('/api/gamedata', requestOptions)
		.then((response) => response.json())
		.then((data) => {
			devConfig = data.dev;

			let lobbyContainer = document.getElementById('lobbyContainer')!;
			lobbyContainer.innerHTML = data.html;

			const gameCards = document.querySelectorAll('.gameLobby');
			gameCards.forEach((game) => {
				game.addEventListener('click', () => {
					const gameID = parseInt(game.id);
					console.log('Clicked game ID:', gameID);

					joinGame(gameID, (window as any).gameData.socketID);
				});
			});

			let modalElement = document.getElementById('promptModal')!;

			if (!data.authenticated) {
				let modal = new Modal(modalElement);
				modal.show();
			}
		});
}

export function joinGame(gameID: number, socketID: number) {
	let headers = new Headers();
	headers.append('Authorization', 'Bearer ' + localStorage.token);

	let requestOptions: RequestInit = {
		method: 'GET',
		headers: headers as HeadersInit,
		redirect: 'follow'
	};

	let url = '/api/join';
	let params = { gameID: gameID.toString(), socketID: socketID.toString() };
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

document.getElementById('guestBtn')!.addEventListener('click', function () {
	let modal = document.getElementById('promptModal')!;
	modal.classList.remove('show');
	modal.style.display = 'none';

	let backdrops = document.getElementsByClassName('modal-backdrop') as HTMLCollectionOf<HTMLElement>;
	for (let i = 0; i < backdrops.length; i++) {
		backdrops[i].parentNode!.removeChild(backdrops[i]);
	}
});

document.getElementById('registerBtn')!.addEventListener('click', function () {
	window.location.href = '/register';
});

document.getElementById('loginBtn')!.addEventListener('click', function () {
	window.location.href = '/login';
});
