import Enum from '../enums/enum';

export default abstract class PlannedAction {
	private readonly actionTypeIndex: number;

	protected constructor(actionTypeIndex: number) {
		this.actionTypeIndex = actionTypeIndex;
	}

	public getActionType() {
		return Enum.ActionType.getFromIndex(this.actionTypeIndex);
	}
}
