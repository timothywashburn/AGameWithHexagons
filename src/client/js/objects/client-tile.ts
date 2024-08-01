import {TileSnapshot} from '../../../shared/interfaces/snapshot';
import ServerTroop from '../../../server/objects/server-troop';
import ServerBuilding from '../../../server/objects/server-building';
import ClientTroop from './client-troop';
import ClientBuilding from './client-building';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let apothem = 30
let radius = apothem / Math.cos(Math.PI / 6);

const hexagon = new Image();
const hexagonSelected = new Image();
const hexagonHover = new Image();
hexagon.src = 'images/hexagon.svg';
hexagonSelected.src = 'images/hexagon-selected.svg';
hexagonHover.src = 'images/hexagon-hover.svg';

export default class ClientTile {
	public id: number;
	public x: number;
	public y: number;

	public color: string;
	public troop: ClientTroop | null = null;
	public building: ClientBuilding | null = null;

	public isSelected: boolean;
	public isHovered: boolean;

	public canvasX: number | undefined;
	public canvasY: number | undefined;
	public path: Path2D | undefined;

	constructor(tileData: TileSnapshot) {
		this.id = tileData.id;
		this.x = tileData.x;
		this.y = tileData.y;

		if((this.x + this.y) % 2 !== 0) {
			throw new Error(`Tile at ${this.x}, ${this.y} is not valid`);
		}

		this.color = tileData.color;

		this.isSelected = false;
		this.isHovered = false;
	}

	updateTile(find: any) {
		//
	}

	renderTile() {
		this.canvasX = canvas.width / 2 + this.x * apothem;
		this.canvasY = canvas.height / 2 - this.y * radius * (1 + Math.sin(Math.PI / 6));

		this.path = new Path2D();
		for (let i = 0; i < 6; i++) {
			let pointX = this.canvasX + radius * Math.cos(Math.PI / 3 * i + Math.PI / 6);
			let pointY = this.canvasY + radius * Math.sin(Math.PI / 3 * i + Math.PI / 6);
			if(i === 0) {
				this.path.moveTo(pointX, pointY);
			} else this.path.lineTo(pointX, pointY);
		}
		this.path.closePath();

		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fill(this.path);
		ctx.restore();

		ctx.save();
		ctx.drawImage(this.getImage(), this.canvasX - radius, this.canvasY - radius, radius * 2, radius * 2);
		ctx.restore();

		ctx.stroke(this.path);
	}

	getImage() {
		if (this.isSelected) return hexagonSelected;
		if (this.isHovered) return hexagonHover;
		return hexagon;
	}
}
