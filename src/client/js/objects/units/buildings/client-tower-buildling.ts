import { BuildingSnapshot } from '../../../../../shared/interfaces/snapshot';
import ClientBuilding from '../../client-building';
import Enum from '../../../../../shared/enums/enum';
import { ClientUnitState } from '../../../../../shared/enums/game/client-unit-state';

export default class ClientTowerBuilding extends ClientBuilding {
	constructor(buildingSnapshot: BuildingSnapshot) {
		super(buildingSnapshot);
	}

	getImageName(): string {
		return 'account';
	}
}
