export interface ElementSnapshot {
    id: number
}

export interface GameSnapshot extends ElementSnapshot {
    isAuthenticated: boolean,
    players: PlayerSnapshot[],
    tiles: TileSnapshot[],
    troops: TroopSnapshot[],
    buildings: BuildingSnapshot[]
}

export interface PlayerSnapshot extends ElementSnapshot {
    color: string
}

export interface TileSnapshot extends ElementSnapshot {
    x: number,
    y: number,
    color: string,
    troopID?: number,
    buildingID?: number
}

export interface TroopSnapshot extends ElementSnapshot {
    ownerID: number,
    parentTileID: number
}

export interface BuildingSnapshot extends ElementSnapshot {
    ownerID: number,
    parentTileID: number
}