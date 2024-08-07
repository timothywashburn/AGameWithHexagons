import { PlayerSnapshot } from '../../../shared/interfaces/snapshot';
import { getGame } from './client-game';
import ClientElement from './client-element';

export default class ClientPlayer extends ClientElement {
	public color: string;

	constructor(playerSnapshot: PlayerSnapshot) {
		super(playerSnapshot.id);

		this.updatePlayer(playerSnapshot);

		getGame().players.push(this);
	}

	updatePlayer(playerSnapshot: PlayerSnapshot) {
		this.color = playerSnapshot.color;
	}

	static getClient(id: number): ClientPlayer | null {
		for (let client of getGame().players) if (client.id === id) return client;
		console.error(`PLAYER NOT FOUND: ${id}`);
		return null;
	}
}
