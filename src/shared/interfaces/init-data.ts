export default interface GameInitData {
    isAuthenticated: boolean,
    tiles: TileInitData[],
    troops: TroopInitData[]
}

export interface TileInitData {
    id: number,
    x: number,
    y: number,
    color: string,
}

export interface TroopInitData {
    id: number,
    ownerID: number,
    parentTileID: number
}