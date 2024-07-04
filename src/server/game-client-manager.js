const PacketClientGameInfo = require('../shared/packets/packet-client-game-info.js');
const PacketClientAnnouncement = require('../shared/packets/packet-client-announcement.js');
const { AnnouncementType } = require('../shared/enums.js');

class GameClientManager {
	clients = [];

	constructor(game) {
		this.game = game;

		this.maxPlayers = 8;
	}

	addClientToGame(client) {
		this.clients.push(client);

		this.updatePlayerList();
		this.sendAlert(client, AnnouncementType.GAME_JOIN);

		this.game.sendBoard(client);
	}

	updatePlayerList() {
		let packet = new PacketClientGameInfo(this.clients);

		this.clients.forEach((client) => {
			packet.addClient(client);
			packet.send(client.socket);
		});
	}

	sendAlert(client, announcementType) {
		let packet = new PacketClientAnnouncement(client.id, announcementType.code);

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
