const { Packet, PacketType } = require('../shared/packets/packet.js');
const { Client, globalClients } = require('./client.js');

let lobbies = [];

function getLobby(lobbyId) {
	return lobbies[lobbyId];
}

class GameLobby {
	clients = [];

	constructor(io) {
		this.io = io;
		this.setupListeners();
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
	}

	setupListeners() {}
}

module.exports = {
	GameLobby,
	getLobby,
	lobbies,
};
