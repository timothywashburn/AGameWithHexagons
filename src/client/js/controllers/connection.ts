import Packet, { ClientPacketID, getPacketName, PacketDestination } from '../../../shared/packets/base/packet';
import { io } from 'socket.io-client';
import { devConfig, joinGame } from '../pages/play';
import { ClientGame } from '../objects/client-game';
import PacketClientAnnouncement from '../../../shared/packets/client/packet-client-announcement';
import PacketClientGameInit from '../../../shared/packets/client/packet-client-game-init';
import PacketClientPlayerListInfo from '../../../shared/packets/client/packet-client-player-list-info';
import PacketClientChat from '../../../shared/packets/client/packet-client-chat';
import { UserProfile } from '../../../server/objects/server-client';
import { updateTurnText } from './ui-overlay';
import PacketClientTurnStart from '../../../shared/packets/client/packet-client-turn-start';
import PacketClientDev from '../../../shared/packets/client/packet-client-dev';
import { isDev } from '../../../server/misc/utils';
import Enum from '../../../shared/enums/enum';
import { AnnouncementType } from '../../../shared/enums/packet/announcement-type';
import thePlayer from '../objects/client-the-player';
import { onReceivePlannedActions } from './client-action-handler';
import {disableMoveOptionRendering, setSelectedTile} from "./render";
import PacketClientSocketResponse from "../../../shared/packets/client/packet-client-socket-response";
import {getCookie} from "./cookie-handler";

export const clientSocket = (io as any).connect();

clientSocket.on('connect', () => {
	(window as any).gameData.socketID = clientSocket.id;
	const intervalID = setInterval(() => {
		if (!devConfig) return;
		clearInterval(intervalID);
		if (devConfig.autoJoin) joinGame(1, (window as any).gameData.socketID);
	}, 10);

	clientSocket.emit('header', getCookie("token"));
});

clientSocket.on('packet', function (packet: Packet) {
	if (packet.packetDestination !== PacketDestination.CLIENT_BOUND) return;
	console.log(`receiving packet: ` + getPacketName(packet.packetTypeID));

	if (packet.packetTypeID === ClientPacketID.DEV.id && isDev) {
		let packetClientDev = packet as PacketClientDev;

		if (packetClientDev.data.action) {
			let action = packetClientDev.data.action;
			if (action == 'HIDE_START_GAME_BUTTON') {
				const button = document.getElementById('start-game-button') as HTMLButtonElement;
				button.style.display = 'none';
			}
		}

	} else if (packet.packetTypeID === ClientPacketID.SOCKET_RESPONSE.id) {
		let packetClientSocketResponse = packet as PacketClientSocketResponse;

		console.log(`CLIENT ID: ${packetClientSocketResponse.initData.clientID}`);
		thePlayer.setID(packetClientSocketResponse.initData.clientID);
	} else if (packet.packetTypeID === ClientPacketID.GAME_INIT.id) {
		let packetClientGameInit = packet as PacketClientGameInit;

		(window as any).gameData.initData = packetClientGameInit.initData;
		new ClientGame(packetClientGameInit.initData);

		if (devConfig.hideChat) document.getElementById('chatBox')!.style.display = 'none';
		if (devConfig.hidePlayerList) document.getElementById('playerList')!.style.display = 'none';

		onReceivePlannedActions(packetClientGameInit.initData.plannedActions);
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
			(playerListEntry: UserProfile) => playerListEntry.userID === packetClientChat.clientID
		);
		message.innerHTML = client.username + ': ' + packetClientChat.message;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	} else if (packet.packetTypeID === ClientPacketID.ANNOUNCEMENT.id) {
		let packetClientAnnouncement = packet as PacketClientAnnouncement;

		const chatMessages = document.getElementById('chatMessages')!;
		const message = document.createElement('div');

		let client = (window as any).gameData.playerListInfo.find(
			(playerListEntry: UserProfile) => playerListEntry.userID === packetClientAnnouncement.clientID
		);

		let announcement: AnnouncementType = Enum.AnnouncementType.getFromIndex(
			packetClientAnnouncement.announcementID
		);

		message.innerHTML = client.username + ' ' + announcement.message;
		message.style.color = announcement.color;

		chatMessages.appendChild(message);
		chatMessages.scrollTop = chatMessages.scrollHeight;
	} else if (packet.packetTypeID === ClientPacketID.TURN_START.id) {
		let packetClientTurnStart = packet as PacketClientTurnStart

		disableMoveOptionRendering();

		setTimeout(() => {
			setSelectedTile(thePlayer.getGame().selectedTile, true);
		}, 100);

		thePlayer.clearPlannedActions();
		thePlayer.getGame().updateGame(packetClientTurnStart.snapshot);

		thePlayer.getGame().updateTurnInfo(packetClientTurnStart.turnNumber, packetClientTurnStart.turnTypeIndex);

		const button = document.getElementById('end-turn-button') as HTMLButtonElement;
		button.disabled = false;
		updateTurnText();
	}
});
