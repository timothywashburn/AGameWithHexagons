import { Socket } from 'socket.io';
import Packet from '../../shared/packets/base/packet';
import PacketServerChat from '../../shared/packets/server/packet-server-chat';
import ServerGame from './server-game';
import PacketClientChat from '../../shared/packets/client/packet-client-chat';
import { generateUsername } from 'unique-username-generator';
import ResponsePacket from '../../shared/packets/base/response-packet';
import PacketServerEndTurn, { PacketServerEndTurnReply } from '../../shared/packets/server/packet-server-end-turn';
import PacketServerDev from '../../shared/packets/server/packet-server-dev';
import { isDev } from '../misc/utils';
import PacketClientSocketResponse from '../../shared/packets/client/packet-client-socket-response';
import { generateGuestToken, getGuestProfile, validateUser } from '../controllers/authentication';
import Enum from '../../shared/enums/enum';

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
		this.profile = new UserProfile(nextID--, generateUsername('', 3, 20));

		socket.on('disconnect', () => {
			if (this.game) this.game.connectionManager.disconnectClient(this);
			ServerClient.clientList = ServerClient.clientList.filter((client) => client !== this);
		});

		socket.on('header', (token: string, guestToken: string) => {
			this.handleHeader(token, guestToken).then((guestToken) => {
				let packet = new PacketClientSocketResponse({ clientID: this.getID(), guestToken: guestToken });
				packet.addClient(this).sendToClients();
			});
		});

		socket.on('packet', (packet: Packet) => {
			if (Enum.PacketDestination.getFromIndex(packet.packetDestination) !== Enum.PacketDestination.SERVER_BOUND)
				return;

			if (packet.packetTypeIndex === Enum.ServerPacketType.DEV.getIndex() && isDev) {
				let packetServerDev = packet as PacketServerDev;

				if (packetServerDev.data.action) {
					let action = packetServerDev.data.action;
					if (action === 'START_GAME') {
						this.game?.start();
					}
				}
			} else if (packet.packetTypeIndex === Enum.ServerPacketType.CHAT.getIndex()) {
				let packetServerChat = packet as PacketServerChat;

				console.log(`Receiving chat message from client ${this.getID()}: ${packetServerChat.message}`);
				let message = packetServerChat.message;
				let responsePacket = new PacketClientChat(this.profile.userID, message);

				this.getGame().connectionManager.clients.forEach((client: ServerClient) =>
					responsePacket.addClient(client)
				);

				responsePacket.sendToClients();
			}

			if (packet.packetTypeIndex === Enum.ServerPacketType.END_TURN.getIndex()) {
				let packetEndTurn = packet as PacketServerEndTurn;
				let player = this.getPlayer();

				let success = false;
				if (this.getGame().isRunning && player != null) {
					success = true;
					player.plannedActions = packetEndTurn.plannedActions;
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
		// TODO: Figure out if ids should be done this way or not.

		//TODO: Make it so the user is authenticated as soon as this object is created instead of waiting for another HTTP request.
		return this.profile.userID;
	}

	getGame() {
		return this.game!;
	}

	setGame(game: ServerGame) {
		this.game = game;
	}

	getPlayer() {
		if (!this.game) return null;

		return this.game?.getPlayer(this.profile.userID);
	}

	static getClient(id: number): ServerClient | null {
		for (let client of ServerClient.clientList) if (client.getID() === id) return client;
		console.error(`CLIENT NOT FOUND: ${id}`);
		return null;
	}

	private async handleHeader(token: string, guestToken: string): Promise<string | null> {
		const currentID = nextID;

		if (guestToken) {
			let profile = await getGuestProfile(guestToken);
			if (profile != null) this.profile = profile;
		}

		await validateUser(token, this);

		if (currentID + 1 === this.getID()) return await generateGuestToken(this.profile);
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
