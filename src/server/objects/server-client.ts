import {Socket} from "socket.io";
import Packet from '../../shared/packets/packet';
import PacketServerChat from '../../shared/packets/packet-server-chat';
import ServerGame from './server-game';

const { PacketType } = require('../../shared/packets/packet');
const PacketClientChat = require('../../shared/packets/packet-client-chat');
const { generateUsername } = require("unique-username-generator");
const { ServerPacket } = require('../../shared/packets/packet');
const { TeamColor } = require('../../shared/enums');

let nextColor = 0;
let nextID = -1;

export default class ServerClient {
	public static clientList: ServerClient[] = [];

	public game: ServerGame | null = null;

	public color: typeof TeamColor;
	public socket: Socket;
	public isAuthenticated: boolean;
	public profile: UserProfile;

	constructor(socket: Socket) {
		ServerClient.clientList.push(this);

		this.color = Object.values(TeamColor)[nextColor++ % Object.keys(TeamColor).length];

		this.socket = socket;
		this.isAuthenticated = false;
		this.profile = new UserProfile(nextID--, generateUsername("", 3, 20));

		socket.on('disconnect', () => {
			if (this.game) this.game.removePlayer(this);
			ServerClient.clientList = ServerClient.clientList.filter(client => client !== this);
		});

		socket.on('packet', (packet: Packet) => {
			if (!packet.type === PacketType.SERVER_BOUND) return;

			if(packet.id === ServerPacket.CHAT.id) {
				let packetServerChat = packet as PacketServerChat;

				console.log(`Receiving chat message from client ${this.getID()}: ${packetServerChat.message}`);
				let message = packetServerChat.message;
				let response = new PacketClientChat(this.profile.userID, message);

				this.game!.clientManager.clients.forEach((client: ServerClient) => {
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

export class UserProfile {
	userID: number;
	username: string;

	constructor(userID: number, username: string) {
		this.userID = userID;
		this.username = username;
	}
}