import {PlayerSnapshot} from '../../../shared/interfaces/snapshot';
import {getGame} from './client-game';

export default class ClientPlayer {
	public id: number;
	public color: string;

	constructor(playerData: PlayerSnapshot) {
		this.id = playerData.id;
		this.color = playerData.color;
	}

	static getClient(id: number): ClientPlayer | null {
		for (let client of getGame().players) if (client.id === id) return client;
		console.error(`PLAYER NOT FOUND: ${id}`);
		return null;
	}
}
