import Packet, { ClientPacketID, getPacketName, PacketDestination } from '../../../shared/packets/base/packet';
import { AnnouncementType, AnnouncementTypeData } from '../../../shared/enums/misc-enums';
import { io } from 'socket.io-client';
import { devConfig, joinGame } from '../pages/play';
import { ClientGame, getGame } from '../objects/client-game';
import PacketClientAnnouncement from '../../../shared/packets/client/packet-client-announcement';
import PacketClientGameInit from '../../../shared/packets/client/packet-client-game-init';
import PacketClientGameSnapshot from '../../../shared/packets/client/packet-client-game-snapshot';
import PacketClientPlayerListInfo from '../../../shared/packets/client/packet-client-player-list-info';
import PacketClientChat from '../../../shared/packets/client/packet-client-chat';
import { UserProfile } from '../../../server/objects/server-client';

export const clientSocket = (io as any).connect();

clientSocket.on('connect', () => {
	(window as any).gameData.socketID = clientSocket.id;
	const intervalID = setInterval(() => {
		if (!devConfig) return;
		clearInterval(intervalID);
		if (devConfig.autoJoin) joinGame(1, (window as any).gameData.socketID);
	}, 10);
});

clientSocket.on('packet', function (packet: Packet) {
	if (packet.packetDestination !== PacketDestination.CLIENT_BOUND) return;
	console.log(`receiving packet: ` + getPacketName(packet.packetTypeID));

	if (packet.packetTypeID === ClientPacketID.GAME_INIT.id) {
		let packetClientGameInit = packet as PacketClientGameInit;

		(window as any).gameData.initData = packetClientGameInit.initData;
		new ClientGame(packetClientGameInit.initData);

		if (devConfig.hideChat) document.getElementById('chatBox')!.style.display = 'none';
		if (devConfig.hidePlayerList) document.getElementById('playerList')!.style.display = 'none';
	} else if (packet.packetTypeID === ClientPacketID.GAME_SNAPSHOT.id) {
		let packetClientGameSnapshot = packet as PacketClientGameSnapshot;
		getGame().updateGame(packetClientGameSnapshot.snapshot);
	} else if (packet.packetTypeID === ClientPacketID.PLAYER_LIST_INFO.id) {
		let packetClientPlayerListInfo = packet as PacketClientPlayerListInfo;

		(window as any).gameData.playerListInfo = packetClientPlayerListInfo.playerListInfo;

		const playerList = document.getElementById('playerList')!;
		playerList.innerHTML = '';

		(window as any).gameData.playerListInfo.forEach((playerListEntry: UserProfile) => {
			const listItem = document.createElement('li');

			const name = document.createTextNode(playerListEntry.username);
			listItem.appendChild(name);

			playerList.appendChild(listItem);
		});
	} else if (packet.packetTypeID === ClientPacketID.CHAT.id) {
		let packetClientChat = packet as PacketClientChat;

		const chatMessages = document.getElementById('chatMessages')!;
		const message = document.createElement('div')!;

		let client = (window as any).gameData.playerListInfo.find(
			(playerListEntry: UserProfile) => playerListEntry.userID === packetClientChat.clientID,
		);
		message.innerHTML = client.username + ': ' + packetClientChat.message;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	} else if (packet.packetTypeID === ClientPacketID.ANNOUNCEMENT.id) {
		let packetClientAnnouncement = packet as PacketClientAnnouncement;

		const chatMessages = document.getElementById('chatMessages')!;
		const message = document.createElement('div');

		let client = (window as any).gameData.playerListInfo.find(
			(playerListEntry: UserProfile) => playerListEntry.userID === packetClientAnnouncement.clientID,
		);

		let announcement: AnnouncementTypeData = Object.values(AnnouncementType).find(
			(announcement) => announcement.id === packetClientAnnouncement.announcementID,
		)!;

		message.innerHTML = client.username + ' ' + announcement.message;
		message.style.color = announcement.color;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	}
});
