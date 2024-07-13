const PacketClientServerListInfo = require('../../shared/packets/packet-client-player-list-info.js');
const PacketClientAnnouncement = require('../../shared/packets/packet-client-announcement.js');
const { AnnouncementType } = require('../../shared/enums.js');
const PacketClientGameInit = require('../../shared/packets/packet-client-game-init');
const server = require('../server');

class GameClientManager {
	private clients = [];
	private teamColors = []
	private readonly game: any;
	private maxPlayers: number;

	constructor(game) {
		this.game = game;

		this.maxPlayers = 8;
	}

	async addClientToGame(client, initData) {
		this.clients.push(client);
		client.game = this.game;

		let packet = new PacketClientGameInit({...initData, ...this.game.getClientInitData(client)});
		packet.addClient(client);
		await packet.send(server);

		this.game.sendSnapshot(client);

		this.updatePlayerList();
		this.sendAlert(client, AnnouncementType.GAME_JOIN);
	}

	updatePlayerList() {
		let playerListInfo = [];
		for (let client of this.clients) playerListInfo.push(client.profile);

		let packet = new PacketClientServerListInfo(playerListInfo);

		this.clients.forEach((client) => {
			packet.addClient(client);
			packet.send(client.socket);
		});
	}

	sendAlert(client, announcementType) {
		let packet = new PacketClientAnnouncement(client.profile.userID, announcementType.id);

		this.clients.forEach((client) => {
			packet.addClient(client);
		});

		packet.send();
	}

	sendPacket(packet) {
		this.clients.forEach((client) => {
			packet.addClient(client);
			packet.send(client.socket);
		});
	}
}

module.exports = GameClientManager
