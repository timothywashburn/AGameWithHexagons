import { PacketType } from '../../shared/packets/packet';
import { NameErrorType, AnnouncementType } from '../../shared/enums';
import { showCanvas } from './play';
import { io } from 'socket.io-client';

export const socket = io.connect();

socket.on('connect', () => {
	window.socketID = socket.id;
});

socket.on('packet', function (packet) {
	if(packet.type !== PacketType.CLIENT_BOUND) return;
	console.log(packet);

	if(packet.id === 0x01) showCanvas();

	if(packet.id === 0x03) {
		if(packet.code === 0x00) {
			window.clientName = packet.name;

			let modal = document.getElementById('usernameModal');
			modal.classList.remove('show');
			modal.style.display = 'none';

			let backdrops = document.getElementsByClassName('modal-backdrop');
			for (let i = 0; i < backdrops.length; i++) {
				backdrops[i].parentNode.removeChild(backdrops[i]);
			}

			return;
		}

		let error = Object.values(NameErrorType).find((error) => error.code === packet.code);
		document.getElementById('usernameError').innerHTML = error.message;
	}

	if(packet.id === 0x04) {
		window.clients = packet.lobbyClients;

		const playerList = document.getElementById('playerList');
		playerList.innerHTML = ''; // Clear the list

		window.clients.forEach((client) => {
			const listItem = document.createElement('li');

			const name = document.createTextNode(client.name); // Assuming each client object has a 'name' property
			listItem.appendChild(name);

			playerList.appendChild(listItem);
		});
	}

	if(packet.id === 0x06) {
		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = window.clients.find((client) => client.id === packet.clientID);

		message.innerHTML = client.name + ': ' + packet.message;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}

	if(packet.id === 0x07) {
		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = window.clients.find((client) => client.id === packet.clientID);

		let announcement = Object.values(AnnouncementType).find((announcement) => announcement.code === packet.code);

		message.innerHTML = client.name + " " + announcement.message;
		message.style.color = announcement.color;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
});
