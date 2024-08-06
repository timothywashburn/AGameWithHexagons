import {Socket} from "socket.io";
import Packet, {PacketDestination, ServerPacketID} from '../../shared/packets/base/packet';
import PacketServerChat from '../../shared/packets/server/packet-server-chat';
import ServerGame from './server-game';
import PacketClientChat from '../../shared/packets/client/packet-client-chat';
import {generateUsername} from 'unique-username-generator';
import PacketServerSpawnUnit from '../../shared/packets/server/packet-server-spawn-unit';
import ServerTroop from './server-troop';
import ServerTile from './server-tile';

let nextID = -1;

export default class ServerClient {
	public static clientList: ServerClient[] = [];

	public game: ServerGame | null = null;

	public socket: Socket;
	public isAuthenticated: boolean;
	public isConnected: boolean = true;
	public profile: UserProfile;

	constructor(socket: Socket) {
		ServerClient.clientList.push(this);

		this.socket = socket;
		this.isAuthenticated = false;
		this.profile = new UserProfile(nextID--, generateUsername("", 3, 20));

		socket.on('disconnect', () => {
			if (this.game) this.game.clientManager.disconnectClient(this);
			ServerClient.clientList = ServerClient.clientList.filter(client => client !== this);
		});

		socket.on('packet', (packet: Packet) => {
			if (packet.packetDestination !== PacketDestination.SERVER_BOUND) return;

			if (packet.packetTypeID === ServerPacketID.CHAT.id) {
				let packetServerChat = packet as PacketServerChat;

				console.log(`Receiving chat message from client ${this.getID()}: ${packetServerChat.message}`);
				let message = packetServerChat.message;
				let responsePacket = new PacketClientChat(this.profile.userID, message);

				this.game!.clientManager.clients.forEach((client: ServerClient) => {
					responsePacket.addClient(client);
				});

				responsePacket.sendToClients();
			}

			if (packet.packetTypeID === ServerPacketID.SPAWN.id) {
				let packetServerSpawnUnit = packet as PacketServerSpawnUnit;
				let parentTile = this.game!.getTile(packetServerSpawnUnit.tileID)!;
				parentTile.troop = new ServerTroop(this.game!, this);
				this.game?.sendServerSnapshot();
			}
		});
	}

	getID() {
		// TODO: Figure out if ids should be done this way or not
		return this.profile.userID;
	}

	static getClient(id: number): ServerClient | null {
		for (let client of ServerClient.clientList) if (client.getID() === id) return client;
		console.error(`CLIENT NOT FOUND: ${id}`);
		return null;
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