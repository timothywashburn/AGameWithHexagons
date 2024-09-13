import PlannedAction from '../../../shared/game/planned-action';
import Enum from '../../../shared/enums/enum';
import CreateUnitAction from '../../../shared/game/actions/create-unit-action';
import thePlayer from '../objects/client-the-player';
import MoveUnitAction from '../../../shared/game/actions/move-unit-action';

export function onReceivePlannedActions(serializedActions: PlannedAction<any>[]) {
	let serializedActionsQueue = [...serializedActions];
	while (serializedActionsQueue.length != 0) {
		let serializedAction = serializedActionsQueue.shift()!;
		let actionType = Enum.ActionType.getFromIndex(serializedAction.actionTypeIndex);

		if (actionType == Enum.ActionType.CREATE_UNIT) {
			let data = (serializedAction as CreateUnitAction).actionData;
			new CreateUnitAction(data);
		}
	}
}

export async function renderAction(action: PlannedAction<any>) {
	let actionType = Enum.ActionType.getFromIndex(action.actionTypeIndex);

	if (actionType == Enum.ActionType.CREATE_UNIT) {
		let codAction = action as CreateUnitAction;
		codAction.getGhostUnit().render();
	} else if (actionType == Enum.ActionType.MOVE_UNIT) {
		let moveUnitAction = action as MoveUnitAction;
		let troop = thePlayer.getGame().getTroop(moveUnitAction.actionData.troopID);
		let proposedTile = thePlayer.getGame().getTile(moveUnitAction.actionData.tileID);

		if (!troop || !proposedTile) return;

		//TODO: Once ghost rendering is finalized, make this render as a ghost instead.
		troop.getParentTile().troop = null;
		proposedTile.troop = troop;
	}
}
