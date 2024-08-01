import PacketClientGameInit from '../../shared/packets/client/packet-client-game-init';
import PacketClientPlayerListInfo from '../../shared/packets/client/packet-client-player-list-info';
import PacketClientAnnouncement from '../../shared/packets/client/packet-client-announcement';
import ServerClient from '../objects/server-client';
import {AnnouncementTypeData, TeamColor} from '../../shared/enums';
import ServerGame from '../objects/server-game';
import { AnnouncementType } from '../../shared/enums';

export default class GameClientManager {
	public clients: ServerClient[] = [];
	public teamColors: typeof TeamColor[] = []
	public readonly game: ServerGame;
	public maxPlayers: number;

	constructor(game: ServerGame) {
		this.game = game;

		this.maxPlayers = 8;
	}

	async addClientToGame(client: ServerClient) {
		this.clients.push(client);
		client.game = this.game;

		let packet = new PacketClientGameInit(this.game.getFullGameSnapshot(client));
		packet.addClient(client);
		await packet.sendToClients();

		this.updatePlayerList();
		this.sendAlert(client, AnnouncementType.GAME_JOIN);
	}

	updatePlayerList() {
		let playerListInfo = [];
		for (let client of this.clients) playerListInfo.push(client.profile);

		let packet = new PacketClientPlayerListInfo(playerListInfo);

		this.clients.forEach((client) => packet.addClient(client));
		packet.sendToClients();
	}

	sendAlert(client: ServerClient, announcementType: AnnouncementTypeData) {
		let packet = new PacketClientAnnouncement(client.profile.userID, announcementType.id);

		this.clients.forEach((client) => {
			packet.addClient(client);
		});

		packet.sendToClients();
	}
}