import ServerGame from './server-game';
import ServerClient from './server-client';
import { BuildingSnapshot } from '../../shared/interfaces/snapshot';
import { BuildingType } from '../../shared/enums/game/building-type';
import ServerUnit from './server-unit';
import { type } from 'node:os';

export default class ServerBuilding extends ServerUnit {
	public type: BuildingType;

	constructor(type: BuildingType, initData: ServerBuildingInitData) {
		super(initData.game, initData.owner);
		this.type = type;

		this.game.buildings.push(this);
	}

	getBuildingSnapshot(): BuildingSnapshot {
		return {
			id: this.id,
			typeIndex: this.type.getIndex(),
			ownerID: this.owner.getID()
		};
	}

	destroy() {
		this.game.buildings = this.game.buildings.filter((troop) => troop !== this);
		for (let tile of this.game.tiles) {
			if (tile.building != this) continue;
			tile.building = null;
			return;
		}
	}
}

export interface ServerBuildingInitData {
	game: ServerGame;
	owner: ServerClient;
}
