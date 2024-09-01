import { ServerTroopInitData } from '../../server-troop';
import ServerBuilding from '../../server-building';
import Enum from '../../../../shared/enums/enum';

export default class ServerTowerBuilding extends ServerBuilding {
	constructor(initData: ServerTroopInitData) {
		super(Enum.BuildingType.TOWER, initData);
	}
}
