import ServerGame from './server-game';
import ServerClient from './server-client';
import { BuildingSnapshot } from '../../shared/interfaces/snapshot';
import { BuildingType, TroopType } from '../../shared/enums/unit-enums';

let nextID = 0;

export default class ServerBuilding {
	public id: number;
	public type: BuildingType;
	public game: ServerGame;
	public owner: ServerClient;

	constructor(type: BuildingType, initData: ServerBuildingInitData) {
		this.id = nextID++;
		this.type = type;
		this.game = initData.game;
		this.owner = initData.owner;

		this.game.buildings.push(this);
	}

	getBuildingSnapshot(client: ServerClient): BuildingSnapshot {
		return {
			id: this.id,
			type: this.type,
			ownerID: this.owner.getID(),
		};
	}
}

export interface ServerBuildingInitData {
	game: ServerGame;
	owner: ServerClient;
}
