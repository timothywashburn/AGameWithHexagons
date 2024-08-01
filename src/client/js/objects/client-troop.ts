import { getGame } from './client-game'
import ClientTile from "./client-tile";
import {TroopSnapshot} from '../../../shared/interfaces/snapshot';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const circle = new Image();
circle.src = 'images/test.svg';

let radius = 20;

export default class ClientTroop {
	public id: number;
	public ownerID: number;
	public parentTile: ClientTile;

	// public circle;

	constructor(troopData: TroopSnapshot) {
		this.id = troopData.id;
		this.ownerID = troopData.ownerID;
		this.parentTile = this.getParentTile(troopData.parentTileID);
	}

	renderTroop() {
		ctx.save();
		ctx.drawImage(circle, this.parentTile.canvasX! - radius, this.parentTile.canvasY! - radius, radius * 2, radius * 2);
		ctx.restore();
	}

	getParentTile(parentTileID: number): ClientTile {
		return getGame().tiles.find(tile => tile.id === parentTileID)!;
	}

	// prepareSprite() {
	// 	try {
	// 		const response = await fetch('images/test.svg');
	// 		let svgString = await response.text();
	// 		svgString = svgString.replace(/fill="[^"]*"/g, `fill="${color}"`);
	// 	}
	// }
}
