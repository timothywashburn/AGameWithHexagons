import { ClientPacket, PacketType, getPacket } from '../../../shared/packets/packet';
import { AnnouncementType } from '../../../shared/enums';
import { io } from 'socket.io-client';
import {devConfig, joinGame} from '../pages/play';
import { getGame } from '../objects/game'
import { Game } from '../objects/game';
import Packet from '../../../shared/packets/packet'
import PacketClientAnnouncement from '../../../shared/packets/packet-client-announcement';
import PacketClientGameInit from '../../../shared/packets/packet-client-game-init';
import PacketClientGameSnapshot from '../../../shared/packets/packet-client-game-snapshot';
import PacketClientPlayerListInfo from '../../../shared/packets/packet-client-player-list-info';
import PacketClientChat from '../../../shared/packets/packet-client-chat';

export const clientSocket = (io as any).connect();

clientSocket.on('connect', () => {
	(window as any).gameData.socketID = clientSocket.id;
	if (devConfig.autoJoin) joinGame(0, (window as any).gameData.socketID);
});

clientSocket.on('packet', function (packet: Packet) {
	if(packet.type !== PacketType.CLIENT_BOUND) return;
	console.log(`receiving packet: ` + getPacket(packet.id));

	if(packet.id === ClientPacket.GAME_INIT.id) {
		let packetClientGameInit = packet as PacketClientGameInit;

		(window as any).gameData.initData = packetClientGameInit.initData;
		new Game(packetClientGameInit.initData);

		if (devConfig.hideChat) document.getElementById('chatBox').style.display = "none"
		if (devConfig.hidePlayerList) document.getElementById('playerList').style.display = "none"
	} else if(packet.id === ClientPacket.GAME_SNAPSHOT.id) {
		let packetClientGameSnapshot = packet as PacketClientGameSnapshot;
		getGame().updateGame(packetClientGameSnapshot.snapshot);

	} else if(packet.id === ClientPacket.PLAYER_LIST_INFO.id) {
		let packetClientPlayerListInfo = packet as PacketClientPlayerListInfo;

		(window as any).gameData.playerListInfo = packetClientPlayerListInfo.playerListInfo;

		const playerList = document.getElementById('playerList');
		playerList.innerHTML = '';

		(window as any).gameData.playerListInfo.forEach((client) => {
			const listItem = document.createElement('li');

			const name = document.createTextNode(client.username);
			listItem.appendChild(name);

			playerList.appendChild(listItem);
		});

	} else if(packet.id === ClientPacket.CHAT.id) {
		let packetClientChat = packet as PacketClientChat;

		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = (window as any).gameData.playerListInfo.find((client) => client.userID === packetClientChat.clientID);
		message.innerHTML = client.username + ': ' + packetClientChat.message;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;

	} else if(packet.id === ClientPacket.ANNOUNCEMENT.id) {
		let packetClientAnnouncement = packet as PacketClientAnnouncement;

		const chatMessages = document.getElementById('chatMessages');
		const message = document.createElement('div');

		let client = (window as any).gameData.playerListInfo.find((client) => client.userID === packetClientAnnouncement.clientID);

		let announcement = Object.values(AnnouncementType).find((announcement) => announcement.id === packetClientAnnouncement.announcementID);

		message.innerHTML = client.username + " " + announcement.message;
		message.style.color = announcement.color;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
});
