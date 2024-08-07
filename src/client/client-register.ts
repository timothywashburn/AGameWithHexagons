import { BuildingType, TroopType } from '../shared/enums/unit-enums';
import ClientMeleeTroop from './js/objects/units/troops/client-melee-troop';
import ClientRangedTroop from './js/objects/units/troops/client-ranged-troop';
import { BuildingSnapshot, TroopSnapshot } from '../shared/interfaces/snapshot';
import ClientTroop from './js/objects/client-troop';
import ClientTowerBuilding from './js/objects/units/buildings/client-tower-buildling';
import ClientBuilding from './js/objects/client-building';

const clientTroopConstructorMap: {
	[key in TroopType]: ClientTroopConstructor;
} = {
	[TroopType.MELEE]: ClientMeleeTroop,
	[TroopType.RANGED]: ClientRangedTroop,
};

type ClientTroopConstructor = new (troopSnapshot: TroopSnapshot) => ClientTroop;

export const getClientTroopConstructor = (type: TroopType): ClientTroopConstructor => {
	return clientTroopConstructorMap[type];
};

const clientBuildingConstructorMap: {
	[key in BuildingType]: ClientBuildingConstructor;
} = {
	[BuildingType.TOWER]: ClientTowerBuilding,
};

type ClientBuildingConstructor = new (troopSnapshot: BuildingSnapshot) => ClientBuilding;

export const getClientBuildingConstructor = (type: BuildingType): ClientBuildingConstructor => {
	return clientBuildingConstructorMap[type];
};
