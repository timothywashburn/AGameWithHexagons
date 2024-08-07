import { BuildingType, TroopType } from '../shared/enums/unit-enums';
import ServerMeleeTroop from './objects/units/troops/server-melee-troop';
import ServerRangedTroop from './objects/units/troops/server-ranged-troop';
import ServerTroop, { ServerTroopInitData } from './objects/server-troop';
import ServerBuilding from './objects/server-building';
import ServerTowerBuilding from './objects/units/buildings/server-tower-building';

const serverTroopConstructorMap: {
	[key in TroopType]: ServerTroopConstructor;
} = {
	[TroopType.MELEE]: ServerMeleeTroop,
	[TroopType.RANGED]: ServerRangedTroop,
};

type ServerTroopConstructor = new (initData: ServerTroopInitData) => ServerTroop;

export const getServerTroopConstructor = (type: TroopType): ServerTroopConstructor => {
	return serverTroopConstructorMap[type];
};

const serverBuildingConstructorMap: {
	[key in BuildingType]: ServerBuildingConstructor;
} = {
	[BuildingType.TOWER]: ServerTowerBuilding,
};

type ServerBuildingConstructor = new (initData: ServerTroopInitData) => ServerBuilding;

export const getServerBuildingConstructor = (type: BuildingType): ServerBuildingConstructor => {
	return serverBuildingConstructorMap[type];
};
