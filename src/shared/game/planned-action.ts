import Enum from '../enums/enum';
import thePlayer from '../../client/js/objects/client-the-player';
import { ActionType } from '../enums/game/action-type';

export default abstract class PlannedAction<T> {
	public actionTypeIndex: number;
	public actionData: T;

	protected constructor(actionTypeIndex: number, actionData: T) {
		this.actionTypeIndex = actionTypeIndex;
		this.actionData = actionData;

		thePlayer.addPlannedAction(this);
	}
}
