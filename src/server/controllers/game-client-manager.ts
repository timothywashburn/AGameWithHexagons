import PacketClientGameInit from '../../shared/packets/packet-client-game-init';
import PacketClientPlayerListInfo from '../../shared/packets/packet-client-player-list-info';
import PacketClientAnnouncement from '../../shared/packets/packet-client-announcement';
import ServerClient from '../objects/server-client';
import {TeamColor} from '../../shared/enums';
import ServerGame from '../objects/server-game';
import Packet from '../../shared/packets/packet';

const { AnnouncementType } = require('../../shared/enums');
const server = require('../server');

class GameClientManager {
	public clients: ServerClient[] = [];
	public teamColors: typeof TeamColor[] = []
	public readonly game: ServerGame;
	public maxPlayers: number;

	constructor(game: ServerGame) {
		this.game = game;

		this.maxPlayers = 8;
	}

	async addClientToGame(client: ServerClient) {
		this.clients.push(client);
		client.game = this.game;

		let packet = new PacketClientGameInit(this.game.getClientInitData(client));
		packet.addClient(client);
		await packet.send(server);

		this.game.sendSnapshot(client);

		this.updatePlayerList();
		this.sendAlert(client, AnnouncementType.GAME_JOIN);
	}

	updatePlayerList() {
		let playerListInfo = [];
		for (let client of this.clients) playerListInfo.push(client.profile);

		let packet = new PacketClientPlayerListInfo(playerListInfo);

		this.clients.forEach((client) => {
			packet.addClient(client);
			packet.send(client.socket);
		});
	}

	sendAlert(client: ServerClient, announcementType: typeof AnnouncementType) {
		let packet = new PacketClientAnnouncement(client.profile.userID, announcementType.id);

		this.clients.forEach((client) => {
			packet.addClient(client);
		});

		packet.send(client.socket);
	}

	sendPacket(packet: Packet) {
		this.clients.forEach((client) => {
			packet.addClient(client);
			packet.send(client.socket);
		});
	}
}

module.exports = GameClientManager
