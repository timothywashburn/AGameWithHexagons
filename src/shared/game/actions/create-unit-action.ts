import PlannedAction from '../planned-action';
import Enum from '../../enums/enum';
import ClientTroop from '../../../client/js/objects/client-troop';
import ClientBuilding from '../../../client/js/objects/client-building';
import { getClientTroopConstructor } from '../../../client/client-register';
import { TroopSnapshot } from '../../interfaces/snapshot';
import thePlayer from '../../../client/js/objects/client-the-player';
import ClientGhostUnit from '../../../client/js/objects/units/client-ghost-unit';

export interface CreateUnitActionData {
	category: 'troop' | 'building';
	unitTypeIndex: number;
	tileID: number;
}

export default class CreateUnitAction extends PlannedAction<CreateUnitActionData> {
	private ghostUnit: ClientGhostUnit;

	constructor(actionData: CreateUnitActionData) {
		super(Enum.ActionType.CREATE_UNIT, actionData);

		let unitType = Enum.TroopType.getFromIndex(actionData.unitTypeIndex);
		this.ghostUnit = new ClientGhostUnit(unitType, actionData.tileID, Enum.ClientUnitState.PLANNED_BUILD);

		thePlayer.addPlannedAction(this);
	}

	getRenderHelperUnit() {
		return this.ghostUnit;
	}
}
