import {Socket} from "socket.io";
import Packet, {PacketDestination, ServerPacketID} from '../../shared/packets/base/packet';
import PacketServerChat from '../../shared/packets/server/packet-server-chat';
import ServerGame from './server-game';
import PacketClientChat from '../../shared/packets/client/packet-client-chat';
import {generateUsername} from 'unique-username-generator';
import PacketServerSpawnUnit from '../../shared/packets/server/packet-server-spawn-unit';
import ServerTroop, {ServerTroopInitData} from './server-troop';
import ServerMeleeTroop from './units/server-melee-troop';
import {getTroopType, TroopType} from '../../shared/enums/unit-enums';
import {init} from '../controllers/authentication';
import {getServerTroopConstructor} from '../server-register';

let nextID = -1;

export default class ServerClient {
	public static clientList: ServerClient[] = [];

	private game: ServerGame | null = null;

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

				this.getGame().clientManager.clients.forEach((client: ServerClient) => {
					responsePacket.addClient(client);
				});

				responsePacket.sendToClients();
			}

			if (packet.packetTypeID === ServerPacketID.SPAWN.id) {
				let packetServerSpawnUnit = packet as PacketServerSpawnUnit;
				let troopType = getTroopType(packetServerSpawnUnit.troopTypeID);
				let initData: ServerTroopInitData = {
					game: this.getGame(),
					owner: this,
					parentTile: this.getGame().getTile(packetServerSpawnUnit.tileID)!
				};
				let TroopConstructor = getServerTroopConstructor(troopType);
				new TroopConstructor(initData);
				this.getGame().sendServerSnapshot();
			}
		});
	}

	getID() {
		// TODO: Figure out if ids should be done this way or not
		return this.profile.userID;
	}

	getGame() {
		return this.game!;
	}

	setGame(game: ServerGame) {
		this.game = game;
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