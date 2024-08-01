export default interface GameSnapshot {
    isAuthenticated: boolean,
    players: PlayerSnapshot[],
    tiles: TileSnapshot[],
    troops: TroopSnapshot[],
    buildings: BuildingSnapshot[]
}

export interface PlayerSnapshot {
    id: number,
    color: string
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