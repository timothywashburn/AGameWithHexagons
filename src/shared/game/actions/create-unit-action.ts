import PlannedAction from '../planned-action';
import Enum from '../../enums/enum';

export interface CreateUnitActionData {
	category: 'troop' | 'building';
	unitIndex: number;
	tileID: number;
}

export default class CreateUnitAction extends PlannedAction<CreateUnitActionData> {
	constructor(actionData: CreateUnitActionData) {
		super(Enum.ActionType.CREATE_UNIT, actionData);
	}
}
