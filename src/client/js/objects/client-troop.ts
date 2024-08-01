import {getGame} from './client-game'
import ClientTile from "./client-tile";
import {TroopSnapshot} from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import {Client} from 'node-mailjet';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default class ClientTroop {
	public id: number;
	public owner: ClientPlayer;
	public parentTile: ClientTile;

	public sprite = new Image();

	constructor(troopData: TroopSnapshot) {
		this.id = troopData.id;
		this.owner = ClientPlayer.getClient(troopData.ownerID)!;
		this.parentTile = this.getParentTile(troopData.parentTileID);

		this.prepareSprite();
	}

	renderTroop() {
		ctx.save();
		ctx.drawImage(this.sprite, this.parentTile.canvasX! - radius, this.parentTile.canvasY! - radius, radius * 2, radius * 2);
		ctx.restore();
	}

	getParentTile(parentTileID: number): ClientTile {
		return getGame().tiles.find(tile => tile.id === parentTileID)!;
	}

	async prepareSprite() {
		try {
			const response = await fetch('images/test.svg');
			let svgString = await response.text();
			svgString = svgString.replace(/fill:#003545/g, `fill:${this.owner.color}`);

			this.sprite = new Image();
			const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
			this.sprite.src = URL.createObjectURL(svgBlob);
		} catch (error) {
			console.error(error);
		}
	}
}
