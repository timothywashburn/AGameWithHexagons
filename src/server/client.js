const { PacketType } = require('../shared/packets/packet');
const PacketClientChat = require('../shared/packets/packet-client-chat');
const { generateUsername } = require("unique-username-generator");

let globalClients = [];

class Client {
	constructor(game, socket) {
		this.game = game;
		this.id = socket.id;
		this.socket = socket;
		this.authenticated = false;
		this.profile = new UserProfile(-1, generateUsername("", 3));

		socket.on('disconnect', () => {
			game.removePlayer(this);
		});

		socket.on('packet', (packet) => {
			if (!packet.type === PacketType.SERVER_BOUND) return;

			if(packet.id === 0x05) {
				let message = packet.message;
				let response = new PacketClientChat(this.id, message);

				this.game.clientManager.clients.forEach((client) => {
					response.addClient(client);
				});

				response.send(socket);
			}
		});
	}
}

class UserProfile {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	}
}

module.exports = { Client, UserProfile, globalClients };
