import ServerClient from './server-client';
import ServerTroop from './server-troop';
import ServerBuilding from './server-building';
import {TileInitData} from '../../shared/interfaces/init-data';

let nextID = 0;

export default class ServerTile {
    public occupantTroop: ServerTroop | null = null;
    public occupantBuilding: ServerBuilding | null = null;

    public id: number;
    public x: number;
    public y: number;
    public color: string;

    constructor(x: number, y: number) {
        this.id = nextID++;
        this.x = x;
        this.y = y;
        this.color = getRBGAround(134, 44, 54, 40);
    }

    getClientTileData(client: ServerClient): TileInitData {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            color: this.color
        }
    }
}

function getRBGAround(red: number, green: number, blue: number, random: number) {
    let randomMultiplier = Math.random();
    let getRandom = (value: number) => value + randomMultiplier * random - random / 2;
    return `rgb(${getRandom(red)}, ${getRandom(green)}, ${getRandom(blue)}`;
}