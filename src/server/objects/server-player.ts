import ServerGame from './server-game';
import { PlayerSnapshot } from '../../shared/interfaces/snapshot';
import ServerClient from './server-client';
import Enum from '../../shared/enums/enum';
import { TeamColor } from '../../shared/enums/game/team-color';

export default class ServerPlayer {
	public game: ServerGame;
	public client: ServerClient;
	public id: number;

	public color: TeamColor;

	constructor(game: ServerGame, client: ServerClient) {
		this.game = game;
		this.client = client;
		this.id = this.client.getID();

		this.color = Enum.TeamColor.getFromIndex(game.nextPlayerTeamColor++ % Enum.TeamColor.size());

		game.players.push(this);
	}

	getPlayerSnapshot(client: ServerClient): PlayerSnapshot {
		return {
			id: this.client.getID(),
			colorIndex: this.color.getIndex()
		};
	}
}
