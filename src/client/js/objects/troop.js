import { getGame } from './game'

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const circle = new Image();
circle.src = 'images/circle.svg';

let radius = 20;

export default class Troop {
	constructor(troopData) {
		this.id = troopData.id;
		this.ownerID = troopData.ownerID;
		this.parentTile = this.getParentTile(troopData.parentTileID);
	}

	renderTroop() {
		ctx.save();
		ctx.drawImage(circle, this.parentTile.literalX - radius, this.parentTile.literalY - radius, radius * 2, radius * 2);
		ctx.restore();
	}

	getParentTile(parentTileID) {
		return getGame().tiles.find(tile => tile.id === parentTileID);
	}
}
