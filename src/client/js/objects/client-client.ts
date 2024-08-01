import {ClientSnapshot} from '../../../shared/interfaces/snapshot';
import {getGame} from './client-game';

export default class ClientClient {
	public id: number;
	public username: string;
	public color: string;

	constructor(clientData: ClientSnapshot) {
		this.id = clientData.id;
		this.username = clientData.username;
		this.color = clientData.color;
	}

	static getClient(id: number): ClientClient | null {
		for (let client of getGame().clients) if (client.id === id) return client;
		console.error(`CLIENT NOT FOUND: ${id}`);
		return null;
	}
}
