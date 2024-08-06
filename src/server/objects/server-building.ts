import ServerGame from './server-game';
import ServerClient from './server-client';
import ServerTile from './server-tile';
import {BuildingSnapshot, TroopSnapshot} from '../../shared/interfaces/snapshot';

let nextID = 1;

export default class ServerBuilding {
	public id: number;
	public game: ServerGame;
	public owner: ServerClient;

	constructor(game: ServerGame, owner: ServerClient) {
		this.id = nextID++;
		this.game = game;
		this.owner = owner;

		this.game.buildings.push(this);
	}

	getBuildingSnapshot(client: ServerClient): BuildingSnapshot {
		return {
			id: this.id,
			ownerID: this.owner.getID()
		}
	}
}
