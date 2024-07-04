import { ClientPacket, PacketType, getPacket } from '../../../shared/packets/packet';
import { AnnouncementType } from '../../../shared/enums';
import { io } from 'socket.io-client';
import { devConfig, joinGame } from '../pages/play';
import { getGame } from '../pages/game'
import { Game } from '../pages/game';

export const clientSocket = io.connect();

clientSocket.on('connect', () => {
	window.gameData.socketID = clientSocket.id;

	if (devConfig.autoJoin) joinGame(0, window.gameData.socketID);
});

clientSocket.on('packet', function (packet) {
	if(packet.type !== PacketType.CLIENT_BOUND) return;
	console.log(packet);
	console.log(`receiving packet: ` + getPacket(packet.id));

	if(packet.id === ClientPacket.GAME_INIT.id) {
		new Game();

		setTimeout(function(){
			if (devConfig.hideChat) document.getElementById('chatBox').style.display = "none"
			if (devConfig.hidePlayerList) document.getElementById('playerList').style.display = "none"
		}, 5);

	} else if(packet.id === ClientPacket.GAME_SNAPSHOT.id) {
		getGame().loadBoard(packet.snapshot.tiles);

	} else if(packet.id === ClientPacket.PLAYER_LIST_INFO.id) {
		window.gameData.playerListInfo = packet.playerListInfo;

		const playerList = document.getElementById('playerList');
		playerList.innerHTML = '';

		window.gameData.playerListInfo.forEach((client) => {
			const listItem = document.createElement('li');

			const name = document.createTextNode(client.name);
			listItem.appendChild(name);

			playerList.appendChild(listItem);
		});

	} else if(packet.id === ClientPacket.CHAT.id) {
		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = window.gameData.playerListInfo.find((client) => client.id === packet.clientID);

		message.innerHTML = client.name + ': ' + packet.message;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;

	} else if(packet.id === ClientPacket.ANNOUNCEMENT.id) {
		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = window.gameData.playerListInfo.find((client) => client.id === packet.clientID);

		let announcement = Object.values(AnnouncementType).find((announcement) => announcement.id === packet.code);

		message.innerHTML = client.name + " " + announcement.message;
		message.style.color = announcement.color;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
});
