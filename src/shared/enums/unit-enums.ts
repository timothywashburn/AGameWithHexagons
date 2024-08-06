export enum TroopType {
    MELEE = "MELEE",
    RANGED = "RANGED"
}

export function getTroopType(index: number): TroopType {
    return Object.values(TroopType)[index] as TroopType;
}

export enum BuildingType {
    PRODUCTION_BUILDING,
    BASIC_TOWER
}
