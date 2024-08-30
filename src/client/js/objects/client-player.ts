import { PlayerSnapshot } from '../../../shared/interfaces/snapshot';
import { getGame } from './client-game';
import ClientElement from './client-element';
import Enum from '../../../shared/enums/enum';
import { TeamColor } from '../../../shared/enums/game/team-color';

export default class ClientPlayer extends ClientElement {
	public teamColor: TeamColor;

	constructor(playerSnapshot: PlayerSnapshot) {
		super(playerSnapshot.id);

		this.updatePlayer(playerSnapshot);

		getGame().players.push(this);
	}

	updatePlayer(playerSnapshot: PlayerSnapshot) {
		this.teamColor = Enum.TeamColor.getFromIndex(playerSnapshot.colorIndex);
	}

	static getClient(id: number): ClientPlayer | null {
		for (let client of getGame().players) if (client.id === id) return client;
		console.error(`PLAYER NOT FOUND: ${id}`);
		return null;
	}
}
