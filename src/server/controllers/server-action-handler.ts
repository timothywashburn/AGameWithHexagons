import PlannedAction from '../../shared/game/planned-action';
import ServerClient from '../objects/server-client';
import Enum from '../../shared/enums/enum';
import { ServerTroopInitData } from '../objects/server-troop';
import { getServerBuildingConstructor, getServerTroopConstructor } from '../server-register';
import { ServerBuildingInitData } from '../objects/server-building';
import CreateUnitAction from '../../shared/game/actions/create-unit-action';
import MoveUnitAction from '../../shared/game/actions/move-unit-action';

export function handleAction(client: ServerClient, action: PlannedAction<any>) {
	let actionType = Enum.ActionType.getFromIndex(action.actionTypeIndex);

	if (actionType == Enum.ActionType.CREATE_UNIT) {
		let createUnitAction = action as CreateUnitAction;
		let actionData = createUnitAction.actionData;
		let parentTile = client.getGame().getTile(actionData.tileID)!;

		if (actionData.category === 'troop') {
			let troopType = Enum.TroopType.getFromIndex(actionData.unitTypeIndex);
			let initData: ServerTroopInitData = {
				game: client.getGame(),
				owner: client
			};
			let TroopConstructor = getServerTroopConstructor(troopType);
			parentTile.troop = new TroopConstructor(initData);
		} else if (actionData.category === 'building') {
			let buildingType = Enum.BuildingType.getFromIndex(actionData.unitTypeIndex);
			let initData: ServerBuildingInitData = {
				game: client.getGame(),
				owner: client
			};
			let BuildingConstructor = getServerBuildingConstructor(buildingType);
			parentTile.building = new BuildingConstructor(initData);
		}
	} else if (actionType == Enum.ActionType.DESTROY_UNIT) {
		let createUnitAction = action as CreateUnitAction;
		let actionData = createUnitAction.actionData;
		let parentTile = client.getGame().getTile(actionData.tileID)!;

		if (actionData.category === 'troop') {
			if (parentTile.troop) parentTile.troop.destroy();
		} else if (actionData.category === 'building') {
			if (parentTile.building) parentTile.building.destroy();
		}
	} else if (actionType == Enum.ActionType.MOVE_UNIT) {
		let createUnitAction = action as MoveUnitAction;
		let actionData = createUnitAction.actionData;

		let currentTroop = client.getGame().getTroop(actionData.troopID);
		let proposedTile = client.getGame().getTile(actionData.tileID);

		if (!currentTroop || !proposedTile || currentTroop.hasMoved) return;
		if (currentTroop.owner.getID() != client.getID()) {
			console.log(
				'Troop owned by ' + currentTroop.owner.profile.userID + ' cannot be moved by ' + client.profile.userID
			);
			return;
		}

		let allowed = currentTroop.verifyMove(currentTroop.getParentTile(), proposedTile, client.getGame());
		if (!allowed) {
			console.log(
				'Troop owned by ' + currentTroop.owner.profile.username + ' cannot move to tile ' + proposedTile.id
			);
			return;
		}

		currentTroop.getParentTile().troop = null;
		proposedTile.troop = currentTroop;

		currentTroop.hasMoved = true;
	}
}
