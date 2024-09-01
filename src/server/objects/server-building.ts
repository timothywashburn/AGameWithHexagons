import ServerGame from './server-game';
import ServerClient from './server-client';
import { BuildingSnapshot } from '../../shared/interfaces/snapshot';
import { BuildingType } from '../../shared/enums/game/building-type';

export default class ServerBuilding {
	public id: number;
	public type: BuildingType;
	public game: ServerGame;
	public owner: ServerClient;

	constructor(type: BuildingType, initData: ServerBuildingInitData) {
		this.type = type;
		this.game = initData.game;
		this.owner = initData.owner;
		this.id = this.game.getNextID();

		this.game.buildings.push(this);
	}

	getBuildingSnapshot(client: ServerClient): BuildingSnapshot {
		return {
			id: this.id,
			typeIndex: this.type.getIndex(),
			ownerID: this.owner.getID()
		};
	}
}

export interface ServerBuildingInitData {
	game: ServerGame;
	owner: ServerClient;
}
