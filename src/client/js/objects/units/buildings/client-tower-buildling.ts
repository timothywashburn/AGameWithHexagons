import ClientTroop from '../../client-troop';
import { BuildingSnapshot, TroopSnapshot } from '../../../../../shared/interfaces/snapshot';
import { BuildingType, getTroopType, TroopType } from '../../../../../shared/enums/unit-enums';
import { getGame } from '../../client-game';
import ClientBuilding from '../../client-building';

export default class ClientTowerBuilding extends ClientBuilding {
	constructor(buildingSnapshot: BuildingSnapshot) {
		super(BuildingType.TOWER, buildingSnapshot);
	}

	getImageName(): string {
		return 'account';
	}
}
