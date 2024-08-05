import ServerTile from './server-tile';
import ServerClient from './server-client';
import {TroopSnapshot} from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';

let nextID = 0;

export default class ServerTroop {
	public id: number;
	public game: ServerGame;
	public owner: ServerClient;
	public parentTile: ServerTile;

	constructor(game: ServerGame, owner: ServerClient, parentTile: ServerTile) {
		this.id = nextID++;
		this.game = game;
		this.owner = owner;
		this.parentTile = parentTile;

		parentTile.troop = this;

		this.game.troops.push(this);
	}

	getTroopSnapshot(client: ServerClient): TroopSnapshot {
		return {
			id: this.id,
			ownerID: this.owner.getID(),
			parentTileID: this.parentTile.id
		}
	}
}
