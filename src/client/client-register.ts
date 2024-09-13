import ClientMeleeTroop from './js/objects/units/troops/client-melee-troop';
import ClientRangedTroop from './js/objects/units/troops/client-ranged-troop';
import { BuildingSnapshot, TroopSnapshot } from '../shared/interfaces/snapshot';
import ClientTroop from './js/objects/client-troop';
import ClientTowerBuilding from './js/objects/units/buildings/client-tower-buildling';
import ClientBuilding from './js/objects/client-building';
import { TroopType } from '../shared/enums/game/troop-type';
import Enum from '../shared/enums/enum';
import { BuildingType } from '../shared/enums/game/building-type';
import { ClientUnitState } from '../shared/enums/game/client-unit-state';

type ClientTroopConstructor = new (troopSnapshot: TroopSnapshot) => ClientTroop;

const clientTroopConstructorMap = new Map<TroopType, ClientTroopConstructor>();
clientTroopConstructorMap.set(Enum.TroopType.MELEE, ClientMeleeTroop);
clientTroopConstructorMap.set(Enum.TroopType.RANGED, ClientRangedTroop);

export const getClientTroopConstructor = (type: TroopType): ClientTroopConstructor => {
	return clientTroopConstructorMap.get(type)!;
};

type ClientBuildingConstructor = new (troopSnapshot: BuildingSnapshot) => ClientBuilding;

const clientBuildingConstructorMap = new Map<BuildingType, ClientBuildingConstructor>();
clientBuildingConstructorMap.set(Enum.BuildingType.TOWER, ClientTowerBuilding);

export const getClientBuildingConstructor = (type: BuildingType): ClientBuildingConstructor => {
	return clientBuildingConstructorMap.get(type)!;
};
