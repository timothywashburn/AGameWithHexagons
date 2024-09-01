import ServerMeleeTroop from './objects/units/troops/server-melee-troop';
import ServerRangedTroop from './objects/units/troops/server-ranged-troop';
import ServerTroop, { ServerTroopInitData } from './objects/server-troop';
import ServerBuilding from './objects/server-building';
import ServerTowerBuilding from './objects/units/buildings/server-tower-building';
import Enum from '../shared/enums/enum';
import { TroopType } from '../shared/enums/game/troop-type';
import { BuildingType } from '../shared/enums/game/building-type';

type ServerTroopConstructor = new (initData: ServerTroopInitData) => ServerTroop;

const serverTroopConstructorMap = new Map<TroopType, ServerTroopConstructor>();
serverTroopConstructorMap.set(Enum.TroopType.MELEE, ServerMeleeTroop);
serverTroopConstructorMap.set(Enum.TroopType.RANGED, ServerRangedTroop);

export const getServerTroopConstructor = (type: TroopType): ServerTroopConstructor => {
	return serverTroopConstructorMap.get(type)!;
};

type ServerBuildingConstructor = new (initData: ServerTroopInitData) => ServerBuilding;

const serverBuildingConstructorMap = new Map<BuildingType, ServerBuildingConstructor>();
serverBuildingConstructorMap.set(Enum.BuildingType.TOWER, ServerTowerBuilding);

export const getServerBuildingConstructor = (type: BuildingType): ServerBuildingConstructor => {
	return serverBuildingConstructorMap.get(type)!;
};
