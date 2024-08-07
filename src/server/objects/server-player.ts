import ServerGame from './server-game';
import { TeamColor } from '../../shared/enums/misc-enums';
import { PlayerSnapshot } from '../../shared/interfaces/snapshot';
import ServerClient from './server-client';

let nextColor = 0;

export default class ServerPlayer {
	public game: ServerGame;
	public client: ServerClient;
	public id: number;

	public color: string;

	constructor(game: ServerGame, client: ServerClient) {
		this.game = game;
		this.client = client;
		this.id = this.client.getID();

		this.color = Object.values(TeamColor)[nextColor++ % Object.keys(TeamColor).length];

		game.players.push(this);
	}

	getPlayerSnapshot(client: ServerClient): PlayerSnapshot {
		return {
			id: this.client.getID(),
			color: this.color,
		};
	}
}
