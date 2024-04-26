const { PacketType } = require('../shared/packets/packet');
const PacketClientNameConfirm = require('../shared/packets/packet-client-name-confirm');
const PacketClientChat = require('../shared/packets/packet-client-chat');
const PacketClientAnnouncement = require('../shared/packets/packet-client-announcement');
const { GameLobby, getLobby, lobbies } = require('./game-lobby');
const { NameErrorType, AnnouncementType } = require('../shared/enums');

let globalClients = [];

class Client {
	constructor(socket) {
		this.id = socket.id;
		this.name = 'User';
		this.socket = socket;

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

			if (packet.id === 0x02) {

				let selectedName = packet.name;

				let code = 0x00;
				if (packet.name.toLowerCase() === 'admin') code = NameErrorType.BAD_NAME.code;
				else if (packet.name.length < 3) code = NameErrorType.TOO_SHORT.code;
				else if (packet.name.length > 30) code = NameErrorType.TOO_LONG.code;

				let response = new PacketClientNameConfirm(selectedName, code);
				response.addClient(this);

				response.send(socket);
				this.name = packet.name;

				if (code === 0x00) {
					this.getLobby().sendUpdates();
					this.getLobby().sendAlert(this, AnnouncementType.LOBBY_JOIN);
				}
			}

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

module.exports = { Client, globalClients };
