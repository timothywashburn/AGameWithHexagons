import { getGame } from './game'

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const circle = new Image();
circle.src = 'images/circle.svg';

export default class Troop {
	constructor(troopData) {
		this.id = troopData.id;
		this.ownerID = troopData.ownerID;
		this.parentTile = this.getParentTile(troopData.parentTileID);
	}

	renderTroop() {
		ctx.save();
		ctx.drawImage(circle, this.parentTile.x, this.parentTile.y, 20, 20);
		ctx.restore();
	}

	getParentTile(parentTileID) {
		let game = getGame();
		let tiles = game.time;
		return tiles.find(tile => tile.parentTileID === parentTileID);
	}
}
