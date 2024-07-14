import {Socket} from "socket.io";

const { PacketType } = require('../../shared/packets/packet');
const PacketClientChat = require('../../shared/packets/packet-client-chat');
const { generateUsername } = require("unique-username-generator");
const { ServerPacket } = require('../../shared/packets/packet');
const { TeamColor } = require('../../shared/enums');

let globalClients = [];
let nextColor = 0;
let nextID = -1;

class Client {
	game;

	public color: typeof TeamColor;
	public socket: Socket;
	public authenticated: boolean;
	public profile: UserProfile;

	constructor(socket) {
		this.color = Object.values(TeamColor)[nextColor++ % Object.keys(TeamColor).length];

		this.socket = socket;
		this.authenticated = false;
		this.profile = new UserProfile(nextID--, generateUsername("", 3, 20));

		socket.on('disconnect', () => {
			if (this.game) this.game.removePlayer(this);
			globalClients = globalClients.filter(client => client !== this);
		});

		socket.on('packet', (packet) => {
			if (!packet.type === PacketType.SERVER_BOUND) return;

			if(packet.id === ServerPacket.CHAT.id) {
				console.log(`Receiving chat message from client ${this.getID()}: ${packet.message}`);
				let message = packet.message;
				let response = new PacketClientChat(this.profile.userID, message);

				this.game.clientManager.clients.forEach((client) => {
					response.addClient(client);
				});

				response.send(socket);
			}
		});
	}

	getID() {
		// TODO: Figure out if ids should be done this way or not
		return this.profile.userID;
	}
}

class UserProfile {
	userID: number;
	username: string;

	constructor(userID, username) {
		this.userID = userID;
		this.username = username;
	}
}

module.exports = { Client, UserProfile, globalClients };
