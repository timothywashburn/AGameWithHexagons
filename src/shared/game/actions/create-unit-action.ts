import PlannedAction from '../planned-action';
import Enum from '../../enums/enum';

export default class CreateUnitAction extends PlannedAction {
	public category: 'troop' | 'building';
	public unitIndex: number;
	public tileID: number;

	constructor(category: 'troop' | 'building', unitIndex: number, tileID: number) {
		super(Enum.ActionType.CREATE_UNIT.getIndex());

		this.category = category;
		this.unitIndex = unitIndex;
		this.tileID = tileID;
	}
}
