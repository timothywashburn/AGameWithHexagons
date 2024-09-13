import PlannedAction from '../planned-action';
import Enum from '../../enums/enum';
import thePlayer from '../../../client/js/objects/client-the-player';
import ClientGhostUnit from '../../../client/js/objects/units/client-ghost-unit';
import { TroopType } from '../../enums/game/troop-type';
import { BuildingType } from '../../enums/game/building-type';

export interface DestroyUnitActionData {
	category: 'troop' | 'building';
	tileID: number;
}

export default class DestroyUnitAction extends PlannedAction<DestroyUnitActionData> {
	private readonly ghostUnit: ClientGhostUnit;

	constructor(actionData: DestroyUnitActionData) {
		super(Enum.ActionType.CREATE_UNIT, actionData);

		let unitType: TroopType | BuildingType;
		if (actionData.category == 'troop') {
			let troop = thePlayer.getGame().getTroopByTile(actionData.tileID)!;
			unitType = troop.type;
			troop.destroy();
		} else if (actionData.category == 'building') {
			let building = thePlayer.getGame().getBuildingByTile(actionData.tileID)!;
			unitType = building.type;
			building.destroy();
		}
		this.ghostUnit = new ClientGhostUnit(
			'destroy',
			unitType!,
			actionData.tileID,
			Enum.ClientUnitState.PLANNED_BUILD
		);
	}

	getGhostUnit() {
		return this.ghostUnit;
	}
}
