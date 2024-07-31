import {Socket} from "socket.io";
import Packet from '../../shared/packets/base/packet';
import PacketServerChat from '../../shared/packets/server/packet-server-chat';
import ServerGame from './server-game';

import { PacketType } from '../../shared/packets/base/packet';
import PacketClientChat from '../../shared/packets/client/packet-client-chat';
import { generateUsername } from 'unique-username-generator';
import { ServerPacketType } from '../../shared/packets/base/packet';
import { TeamColor } from '../../shared/enums';

let nextColor = 0;
let nextID = -1;

export default class ServerClient {
	public static clientList: ServerClient[] = [];

	public game: ServerGame | null = null;

	public color: string;
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
			if (packet.type !== PacketType.SERVER_BOUND) return;

			if(packet.id === ServerPacketType.CHAT.id) {
				let packetServerChat = packet as PacketServerChat;

				console.log(`Receiving chat message from client ${this.getID()}: ${packetServerChat.message}`);
				let message = packetServerChat.message;
				let responsePacket = new PacketClientChat(this.profile.userID, message);

				this.game!.clientManager.clients.forEach((client: ServerClient) => {
					responsePacket.addClient(client);
				});

				responsePacket.sendToClients();
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