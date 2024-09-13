import { ActionType } from '../enums/game/action-type';
import thePlayer from '../../client/js/objects/client-the-player';

export default abstract class PlannedAction<T> {
	public actionTypeIndex: number;
	public actionData: T;

	protected constructor(actionTypeIndex: ActionType, actionData: T) {
		this.actionTypeIndex = actionTypeIndex.getIndex();
		this.actionData = actionData;

		thePlayer.addPlannedAction(this);
	}
}
