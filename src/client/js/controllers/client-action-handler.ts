import PlannedAction from '../../../shared/game/planned-action';
import Enum from '../../../shared/enums/enum';
import CreateUnitAction from '../../../shared/game/actions/create-unit-action';
import thePlayer from '../objects/client-the-player';
import MoveUnitAction from "../../../shared/game/actions/move-unit-action";
import {setSelectedTile} from "./render";

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

// TODO: This render code is temporary
let sprite = new Image();
sprite.src = 'images/test.svg';

export function onReceivePlannedActions(plannedActions: PlannedAction<any>[]) {
	let plannedActionsQueue = [...plannedActions];
	while (plannedActionsQueue.length != 0) {
		let action = plannedActionsQueue.shift()!;
		let actionType = Enum.ActionType.getFromIndex(action.actionTypeIndex);

		if (actionType == Enum.ActionType.CREATE_UNIT) {
			let createUnitAction = action as CreateUnitAction;
			new CreateUnitAction(createUnitAction.actionData);
		}
	}
}

export async function renderAction(action: PlannedAction<any>) {
	let actionType = Enum.ActionType.getFromIndex(action.actionTypeIndex);

	if (actionType == Enum.ActionType.CREATE_UNIT) {
		let createUnitAction = action as CreateUnitAction;
		let tile = thePlayer.getGame().getTile(createUnitAction.actionData.tileID)!;

		// TODO:  render code is temporary
		ctx.save();
		ctx.drawImage(sprite, tile.canvasX! - radius, tile.canvasY! - radius, radius * 2, radius * 2);
		ctx.restore();

	} else if (actionType == Enum.ActionType.MOVE) {
		let moveUnitAction = action as MoveUnitAction;
		let troop = thePlayer.getGame().getTroop(moveUnitAction.actionData.troopID);
		let proposedTile = thePlayer.getGame().getTile(moveUnitAction.actionData.tileID);

		if (!troop || !proposedTile) return;

		//TODO: Once ghost rendering is finalized, make this render as a ghost instead.
		troop.getParentTile().troop = null;
		proposedTile.troop = troop;
	}
}
