const PacketClientServerListInfo = require('../../shared/packets/packet-client-player-list-info.js');
const PacketClientAnnouncement = require('../../shared/packets/packet-client-announcement.js');
const { AnnouncementType } = require('../../shared/enums.js');

class GameClientManager {
	clients = [];

	constructor(game) {
		this.game = game;

		this.maxPlayers = 8;
	}

	addClientToGame(client) {
		this.clients.push(client);
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
		let packet = new PacketClientAnnouncement(client.profile.id, announcementType.id);

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
