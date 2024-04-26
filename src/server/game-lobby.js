const { Packet, PacketType } = require('../shared/packets/packet.js');
const { Client, globalClients } = require('./client.js');
const PacketClientLobbyInfo = require('../shared/packets/packet-client-lobby-info.js');

let lobbies = [];

function getLobby(lobbyId) {
	return lobbies[lobbyId];
}

class GameLobby {
	clients = [];

	constructor(io) {
		this.io = io;
		this.maxPlayers = 8;

		lobbies.push(this);
	}

	getName() {
		return `Lobby ${lobbies.indexOf(this) + 1}`;
	}

	isJoinable() {
		return this.clients.length < this.maxPlayers;
	}

	addClient(client) {
		this.clients.push(client);

		console.log('clients in lobby: ', this.clients);

		this.sendUpdates();
	}

	sendUpdates() {
		let packet = new PacketClientLobbyInfo(this.clients);

		this.clients.forEach((client) => {
			packet.addClient(client);
			packet.send(client.socket);
		});
	}
}

module.exports = {
	GameLobby,
	getLobby,
	lobbies,
};
