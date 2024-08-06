import ServerTile from './server-tile';
import ServerClient from './server-client';
import {TroopSnapshot} from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';

let nextID = 1;

export default class ServerTroop {
	public id: number;
	public game: ServerGame;
	public owner: ServerClient;

	constructor(game: ServerGame, owner: ServerClient) {
		this.id = nextID++;
		this.game = game;
		this.owner = owner;

		this.game.troops.push(this);
	}

	getTroopSnapshot(client: ServerClient): TroopSnapshot {
		return {
			id: this.id,
			ownerID: this.owner.getID()
		}
	}
}
