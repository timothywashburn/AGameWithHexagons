import ServerGame from './server-game';
import { GameResources, PlayerSnapshot } from '../../shared/interfaces/snapshot';
import ServerClient from './server-client';
import Enum from '../../shared/enums/enum';
import { TeamColor } from '../../shared/enums/game/team-color';
import PlannedAction from '../../shared/game/planned-action';

export default class ServerPlayer {
	public client: ServerClient;
	public id: number;

	public resources: GameResources;
	public plannedActions: PlannedAction<any>[] = [];

	public color: TeamColor;

	constructor(game: ServerGame, client: ServerClient) {
		this.client = client;
		this.id = this.client.getID();

		this.color = Enum.TeamColor.getFromIndex(game.nextPlayerTeamColor++ % Enum.TeamColor.size());

		this.resources = {
			energy: 0,
			goo: 0
		};

		game.players.push(this);
	}

	getPlayerSnapshot(): PlayerSnapshot {
		return {
			id: this.client.getID(),
			colorIndex: this.color.getIndex()
		};
	}
}
