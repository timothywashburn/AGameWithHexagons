import { BuildingSnapshot } from '../../../../../shared/interfaces/snapshot';
import { BuildingType } from '../../../../../shared/enums/unit-enums';
import ClientBuilding from '../../client-building';

export default class ClientTowerBuilding extends ClientBuilding {
	constructor(buildingSnapshot: BuildingSnapshot) {
		super(BuildingType.TOWER, buildingSnapshot);
	}

	getImageName(): string {
		return 'account';
	}
}
