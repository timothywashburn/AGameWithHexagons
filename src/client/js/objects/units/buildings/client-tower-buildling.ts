import { BuildingSnapshot } from '../../../../../shared/interfaces/snapshot';
import ClientBuilding from '../../client-building';
import Enum from '../../../../../shared/enums/enum';

export default class ClientTowerBuilding extends ClientBuilding {
	constructor(buildingSnapshot: BuildingSnapshot) {
		super(Enum.BuildingType.TOWER, buildingSnapshot);
	}

	getImageName(): string {
		return 'account';
	}
}
