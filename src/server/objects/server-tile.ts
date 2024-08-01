import ServerClient from './server-client';
import ServerTroop from './server-troop';
import ServerBuilding from './server-building';
import {TileSnapshot} from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';

let nextID = 0;

export default class ServerTile {
    public static tileList: ServerTile[] = [];

    public id: number;
    public game: ServerGame;
    public x: number;
    public y: number;
    public color: string;

    public troop: ServerTroop | null = null;
    public building: ServerBuilding | null = null;

    constructor(game: ServerGame, x: number, y: number) {
        this.id = nextID++;
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = getRBGAround(134, 44, 54, 40);

        if (!this.isTileValid()) throw new Error("Invalid tile attempting to load");
        ServerTile.tileList.push(this);
    }

    getTileSnapshot(client: ServerClient): TileSnapshot {
        let snapshot: TileSnapshot = {
            id: this.id,
            x: this.x,
            y: this.y,
            color: this.color,
        };
        if (this.troop) snapshot.troopID = this.troop.id;
        if (this.building) snapshot.buildingID = this.building.id;
        return snapshot;
    }

    isTileValid() {
        return (this.x + this.y) % 2 === 0;
    }

    static getTile(id: number): ServerTile | null {
        for (let game of ServerTile.tileList) if (game.id === id) return game;
        console.error(`TILE NOT FOUND: ${id}`);
        return null;
    }
}

function getRBGAround(red: number, green: number, blue: number, random: number) {
    let randomMultiplier = Math.random();
    let getRandom = (value: number) => value + randomMultiplier * random - random / 2;
    return `rgb(${getRandom(red)}, ${getRandom(green)}, ${getRandom(blue)}`;
}