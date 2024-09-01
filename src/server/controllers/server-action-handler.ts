import PlannedAction from '../../shared/game/planned-action';
import ServerClient from '../objects/server-client';
import Enum from '../../shared/enums/enum';
import { ServerTroopInitData } from '../objects/server-troop';
import { getServerBuildingConstructor, getServerTroopConstructor } from '../server-register';
import { ServerBuildingInitData } from '../objects/server-building';
import CreateUnitAction, { CreateUnitActionData } from '../../shared/game/actions/create-unit-action';

export function handleAction(client: ServerClient, action: PlannedAction<any>) {
	let actionType = Enum.ActionType.getFromIndex(action.actionTypeIndex);

	if (actionType == Enum.ActionType.CREATE_UNIT) {
		let createUnitAction = action as CreateUnitAction;
		let actionData = createUnitAction.actionData;

		let parentTile = client.getGame().getTile(actionData.tileID)!;

		if (actionData.category === 'troop') {
			let troopType = Enum.TroopType.getFromIndex(actionData.unitIndex);
			let initData: ServerTroopInitData = {
				game: client.getGame(),
				owner: client
			};
			let TroopConstructor = getServerTroopConstructor(troopType);
			parentTile.troop = new TroopConstructor(initData);
		} else if (actionData.category === 'building') {
			let buildingType = Enum.BuildingType.getFromIndex(actionData.unitIndex);
			let initData: ServerBuildingInitData = {
				game: client.getGame(),
				owner: client
			};
			let BuildingConstructor = getServerBuildingConstructor(buildingType);
			parentTile.building = new BuildingConstructor(initData);
		}
	}
}
