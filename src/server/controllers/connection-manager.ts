import PacketClientGameInit from '../../shared/packets/client/packet-client-game-init';
import PacketClientPlayerListInfo from '../../shared/packets/client/packet-client-player-list-info';
import PacketClientAnnouncement from '../../shared/packets/client/packet-client-announcement';
import ServerClient from '../objects/server-client';
import ServerGame from '../objects/server-game';
import ServerPlayer from '../objects/server-player';
import Enum from '../../shared/enums/enum';
import { AnnouncementType } from '../../shared/enums/packet/announcement-type';

export default class ConnectionManager {
	public readonly game: ServerGame;

	public clients: ServerClient[] = [];
	public maxPlayers: number;

	public waitingToEndTurn: ServerClient[] = [];

	constructor(game: ServerGame) {
		this.game = game;

		this.maxPlayers = 8;
	}

	async connectClient(client: ServerClient) {
		this.clients.push(client);
		client.setGame(this.game);

		let foundPlayer = false;
		for (let player of this.game.players) {
			if (player.id != client.getID()) continue;
			foundPlayer = true;
			player.client = client;
			break;
		}
		if (!foundPlayer) {
			new ServerPlayer(this.game, client);
		}

		let packet = new PacketClientGameInit(this.game.getGameInitData(client));
		packet.addClient(client);
		await packet.sendToClients();

		this.updatePlayerList();
		this.sendAlert(client, Enum.AnnouncementType.GAME_JOIN);
	}

	disconnectClient(client: ServerClient) {
		this.clients = this.clients.filter((testClient: ServerClient) => testClient !== client);
		this.waitingToEndTurn = this.waitingToEndTurn.filter((testClient: ServerClient) => testClient !== client);

		this.sendAlert(client, Enum.AnnouncementType.GAME_LEAVE);
		this.updatePlayerList();
	}

	updatePlayerList() {
		let playerListInfo = [];
		for (let client of this.clients) playerListInfo.push(client.profile);

		let packet = new PacketClientPlayerListInfo(playerListInfo);
		this.clients.forEach((client) => packet.addClient(client));
		packet.sendToClients();
	}

	sendAlert(client: ServerClient, announcementType: AnnouncementType) {
		let packet = new PacketClientAnnouncement(client.profile.userID, announcementType.getIndex());
		this.clients.forEach((client) => packet.addClient(client));
		packet.sendToClients();
	}
}
