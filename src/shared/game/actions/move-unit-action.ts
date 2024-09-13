import PlannedAction from '../planned-action';
import Enum from '../../enums/enum';

export interface MoveUnitActionData {
	troopID: number;
	tileID: number;
}

export default class MoveUnitAction extends PlannedAction<MoveUnitActionData> {
	constructor(actionData: MoveUnitActionData) {
		super(Enum.ActionType.MOVE_UNIT, actionData);
	}
}
