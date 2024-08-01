import ServerGame from './server-game';
import ServerClient from './server-client';
import ServerTile from './server-tile';
import {BuildingSnapshot, TroopSnapshot} from '../../shared/interfaces/snapshot';

let nextID = 0;

export default class ServerBuilding {
	public id: number;
	public game: ServerGame;
	public owner: ServerClient;
	public parentTile: ServerTile;

	constructor(game: ServerGame, owner: ServerClient, parentTile: ServerTile) {
		this.id = nextID++;
		this.game = game;
		this.owner = owner;
		this.parentTile = parentTile;

		this.game.buildings.push(this);
	}

	getBuildingSnapshot(client: ServerClient): BuildingSnapshot {
		return {
			id: this.id,
			ownerID: this.owner.getID(),
			parentTileID: this.parentTile.id
		}
	}
}
