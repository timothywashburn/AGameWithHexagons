export enum TroopType {
	MELEE = 'MELEE',
	RANGED = 'RANGED',
}

export function getTroopType(index: number): TroopType {
	return Object.values(TroopType)[index] as TroopType;
}

export enum BuildingType {
	TOWER = 'TOWER',
}

export function getBuildingType(index: number): BuildingType {
	return Object.values(BuildingType)[index] as BuildingType;
}
