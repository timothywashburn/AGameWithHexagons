export interface ElementSnapshot {
    id: number
}

export interface GameSnapshot {
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
    typeID: number,
    ownerID: number
}

export interface BuildingSnapshot extends ElementSnapshot {
    ownerID: number
}