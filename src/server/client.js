const { PacketType } = require('../shared/packets/packet');
const PacketClientChat = require('../shared/packets/packet-client-chat');
const {lobbies } = require('./game-lobby');
const {AnnouncementType } = require('../shared/enums');
const { generateUsername } = require("unique-username-generator");


let globalClients = [];

class Client {
	constructor(socket) {
		this.id = socket.id;
		this.socket = socket;
		this.authenticated = false;
		this.profile = new UserProfile(-1, generateUsername("", 3));

		socket.on('disconnect', () => {
			let id = socket.id;
			globalClients = globalClients.filter((client) => client.id !== id);

			let lobby = this.getLobby();

			lobbies.forEach((lobby) => {
				lobby.clients = lobby.clients.filter((client) => client.id !== id);
			});

			if(lobby) {
				lobby.sendAlert(this, AnnouncementType.LOBBY_LEAVE);
				lobby.sendUpdates();
			}
		});

		socket.on('packet', (packet) => {
			if (!packet.type === PacketType.SERVER_BOUND) return;

			if(packet.id === 0x05) {
				let message = packet.message;
				let response = new PacketClientChat(this.id, message);

				let lobby = this.getLobby();
				lobby.clients.forEach((client) => {
					response.addClient(client);
				});

				response.send(socket);
			}
		});
	}

	getLobby() {
		return lobbies.find((lobby) => lobby.clients.includes(this));
	}
}

class UserProfile {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

module.exports = { Client, UserProfile, globalClients };
