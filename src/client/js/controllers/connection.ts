import { ClientPacket, PacketType, getPacket } from '../../../shared/packets/packet';
import { AnnouncementType } from '../../../shared/enums';
import { io } from 'socket.io-client';
import { devConfig } from '../pages/play';
import { getGame } from '../objects/game'
import { Game } from '../objects/game';

export const clientSocket = (io as any).connect();

clientSocket.on('connect', () => {
	(window as any).gameData.socketID = clientSocket.id;
});

clientSocket.on('packet', function (packet) {
	if(packet.type !== PacketType.CLIENT_BOUND) return;
	console.log(`receiving packet: ` + getPacket(packet.id));

	if(packet.id === ClientPacket.GAME_INIT.id) {
		(window as any).gameData.initData = packet.initData;
		new Game(packet.initData);

		if (devConfig.hideChat) document.getElementById('chatBox').style.display = "none"
		if (devConfig.hidePlayerList) document.getElementById('playerList').style.display = "none"
	} else if(packet.id === ClientPacket.GAME_SNAPSHOT.id) {
		getGame().updateGame(packet.snapshot);

	} else if(packet.id === ClientPacket.PLAYER_LIST_INFO.id) {
		(window as any).gameData.playerListInfo = packet.playerListInfo;

		const playerList = document.getElementById('playerList');
		playerList.innerHTML = '';

		(window as any).gameData.playerListInfo.forEach((client) => {
			const listItem = document.createElement('li');

			const name = document.createTextNode(client.username);
			listItem.appendChild(name);

			playerList.appendChild(listItem);
		});

	} else if(packet.id === ClientPacket.CHAT.id) {
		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = (window as any).gameData.playerListInfo.find((client) => client.userID === packet.clientID);
		message.innerHTML = client.username + ': ' + packet.message;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;

	} else if(packet.id === ClientPacket.ANNOUNCEMENT.id) {
		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = (window as any).gameData.playerListInfo.find((client) => client.userID === packet.clientID);

		let announcement = Object.values(AnnouncementType).find((announcement) => announcement.id === packet.announcementID);

		message.innerHTML = client.username + " " + announcement.message;
		message.style.color = announcement.color;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
});