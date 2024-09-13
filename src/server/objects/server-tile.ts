import ServerClient from './server-client';
import ServerTroop from './server-troop';
import ServerBuilding from './server-building';
import { TileSnapshot } from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';

export default class ServerTile {
	public game: ServerGame;

	public id: number;
	public x: number;
	public y: number;
	public color: string;

	public troop: ServerTroop | null = null;
	public building: ServerBuilding | null = null;

	constructor(game: ServerGame, x: number, y: number) {
		this.game = game;

		this.id = this.game.getNextID();
		this.x = x;
		this.y = y;
		this.color = getRBGAround(134, 44, 54, 40);

		if (!this.isTileValid()) throw new Error('Invalid tile attempting to load');
		game.tiles.push(this);
	}

	getTileSnapshot(): TileSnapshot {
		let snapshot: TileSnapshot = {
			id: this.id,
			x: this.x,
			y: this.y,
			color: this.color
		};
		if (this.troop) snapshot.troopID = this.troop.id;
		if (this.building) snapshot.buildingID = this.building.id;
		return snapshot;
	}

	isTileValid() {
		return (this.x + this.y) % 2 === 0;
	}
}

function getRBGAround(red: number, green: number, blue: number, random: number) {
	let randomMultiplier = Math.random();
	let getRandom = (value: number) => value + randomMultiplier * random - random / 2;
	return `rgb(${getRandom(red)}, ${getRandom(green)}, ${getRandom(blue)}`;
}
