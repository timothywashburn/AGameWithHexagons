export default interface GameSnapshot {
    isAuthenticated: boolean,
    tiles: TileSnapshot[],
    troops: TroopSnapshot[]
}

export interface TileSnapshot {
    id: number,
    x: number,
    y: number,
    color: string,
    troopID?: number,
    buildingID?: number
}

export interface TroopSnapshot {
    id: number,
    ownerID: number,
    parentTileID: number
}

export interface BuildingSnapshot {
    id: number,
    ownerID: number,
    parentTileID: number
}