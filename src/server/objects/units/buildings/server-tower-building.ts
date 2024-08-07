import { ServerTroopInitData } from '../../server-troop';
import { BuildingType } from '../../../../shared/enums/unit-enums';
import ServerBuilding from '../../server-building';

export default class ServerTowerBuilding extends ServerBuilding {
	constructor(initData: ServerTroopInitData) {
		super(BuildingType.TOWER, initData);
	}
}
