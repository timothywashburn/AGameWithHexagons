import { Socket } from 'socket.io';
import Packet, { PacketDestination, ServerPacketID } from '../../shared/packets/base/packet';
import PacketServerChat from '../../shared/packets/server/packet-server-chat';
import ServerGame from './server-game';
import PacketClientChat from '../../shared/packets/client/packet-client-chat';
import { generateUsername } from 'unique-username-generator';
import PacketServerSpawnUnit, {
	PacketServerSpawnUnitReply
} from '../../shared/packets/server/packet-server-spawn-unit';
import { ServerTroopInitData } from './server-troop';
import { getServerBuildingConstructor, getServerTroopConstructor } from '../server-register';
import ResponsePacket from '../../shared/packets/base/response-packet';
import { ServerBuildingInitData } from './server-building';
import PacketServerEndTurn, { PacketServerEndTurnReply } from '../../shared/packets/server/packet-server-end-turn';
import { GameResources } from '../../shared/interfaces/snapshot';
import PacketServerDev from '../../shared/packets/server/packet-server-dev';
import { isDev } from '../misc/utils';
import Enum from '../../shared/enums/enum';
import PlannedAction from '../../shared/game/planned-action';

let nextID = -1;

export default class ServerClient {
	public static clientList: ServerClient[] = [];

	private game: ServerGame | null = null;

	public socket: Socket;
	public isAuthenticated: boolean;
	public isConnected: boolean = true;
	public profile: UserProfile;

	public resources: GameResources;
	public plannedActions: PlannedAction[] = [];

	constructor(socket: Socket) {
		ServerClient.clientList.push(this);

		this.socket = socket;
		this.isAuthenticated = false;
		this.profile = new UserProfile(nextID--, generateUsername('', 3, 20));

		this.resources = {
			energy: 0,
			goo: 0
		};

		socket.on('disconnect', () => {
			if (this.game) this.game.connectionManager.disconnectClient(this);
			ServerClient.clientList = ServerClient.clientList.filter((client) => client !== this);
		});

		socket.on('packet', (packet: Packet) => {
			if (packet.packetDestination !== PacketDestination.SERVER_BOUND) return;

			if (packet.packetTypeID === ServerPacketID.DEV.id && isDev) {
				let packetServerDev = packet as PacketServerDev;

				if (packetServerDev.data.action) {
					let action = packetServerDev.data.action;
					if (action === 'START_GAME') {
						this.game?.start();
					}
				}
			} else if (packet.packetTypeID === ServerPacketID.CHAT.id) {
				let packetServerChat = packet as PacketServerChat;

				console.log(`Receiving chat message from client ${this.getID()}: ${packetServerChat.message}`);
				let message = packetServerChat.message;
				let responsePacket = new PacketClientChat(this.profile.userID, message);

				this.getGame().connectionManager.clients.forEach((client: ServerClient) =>
					responsePacket.addClient(client)
				);

				responsePacket.sendToClients();
			}

			if (packet.packetTypeID === ServerPacketID.SPAWN.id && this.getGame().isRunning) {
				let packetServerSpawnUnit = packet as PacketServerSpawnUnit;
				let parentTile = this.getGame().getTile(packetServerSpawnUnit.tileID)!;

				if (packetServerSpawnUnit.category === 'troop') {
					let troopType = Enum.TroopType.getFromIndex(packetServerSpawnUnit.unitIndex);
					let initData: ServerTroopInitData = {
						game: this.getGame(),
						owner: this
					};
					let TroopConstructor = getServerTroopConstructor(troopType);
					parentTile.troop = new TroopConstructor(initData);
				} else if (packetServerSpawnUnit.category === 'building') {
					let buildingType = Enum.BuildingType.getFromIndex(packetServerSpawnUnit.unitIndex);
					let initData: ServerBuildingInitData = {
						game: this.getGame(),
						owner: this
					};
					let BuildingConstructor = getServerBuildingConstructor(buildingType);
					parentTile.building = new BuildingConstructor(initData);
				}

				this.getGame().sendSnapshot(this);

				new ResponsePacket<PacketServerSpawnUnitReply>(packetServerSpawnUnit.packetID, {
					success: true
				}).replyToClient(this);
			}

			if (packet.packetTypeID === ServerPacketID.END_TURN.id) {
				let packetEndTurn = packet as PacketServerEndTurn;

				let success = false;
				if (this.getGame().isRunning) {
					success = true;
					this.plannedActions = packetEndTurn.plannedActions;
					this.getGame().connectionManager.waitingToEndTurn =
						this.getGame().connectionManager.waitingToEndTurn.filter((client) => client !== this);
					this.getGame().attemptEndTurn();
				}

				new ResponsePacket<PacketServerEndTurnReply>(packetEndTurn.packetID, {
					success: success
				}).replyToClient(this);
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
