import { TileSnapshot } from '../../../shared/interfaces/snapshot';
import ClientTroop from './client-troop';
import ClientBuilding from './client-building';
import ClientElement from './client-element';
import thePlayer from './client-the-player';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let apothem = 30;
let radius = apothem / Math.cos(Math.PI / 6);

const hexagon = new Image();
const hexagonSelected = new Image();
const hexagonHover = new Image();
hexagon.src = 'images/hexagon.svg';
hexagonSelected.src = 'images/hexagon-selected.svg';
hexagonHover.src = 'images/hexagon-hover.svg';

export default class ClientTile extends ClientElement {
	public x: number;
	public y: number;

	public color: string;
	public troop: ClientTroop | null = null;
	public building: ClientBuilding | null = null;

	public isHovered: boolean = false;
	public isMoveOption: boolean = false

	public canvasX: number | undefined;
	public canvasY: number | undefined;
	public path: Path2D | undefined;

	constructor(tileSnapshot: TileSnapshot) {
		super(tileSnapshot.id);
		this.x = tileSnapshot.x;
		this.y = tileSnapshot.y;

		if ((this.x + this.y) % 2 !== 0) {
			throw new Error(`Tile at ${this.x}, ${this.y} is not valid`);
		}

		this.updateTile(tileSnapshot);

		thePlayer.getGame().tiles.push(this);
	}

	updateTile(tileSnapshot: TileSnapshot) {
		this.color = tileSnapshot.color;
		this.troop = thePlayer.getGame().getTroop(tileSnapshot.troopID);
		this.building = thePlayer.getGame().getBuilding(tileSnapshot.buildingID);
	}

	renderTile() {
		this.canvasX = canvas.width / 2 + this.x * apothem;
		this.canvasY = canvas.height / 2 - this.y * radius * (1 + Math.sin(Math.PI / 6));

		this.path = new Path2D();
		for (let i = 0; i < 6; i++) {
			let pointX = this.canvasX + radius * Math.cos((Math.PI / 3) * i + Math.PI / 6);
			let pointY = this.canvasY + radius * Math.sin((Math.PI / 3) * i + Math.PI / 6);
			if (i === 0) {
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

		if (this.isMoveOption) {
			ctx.save();
			ctx.fillStyle = 'blue';
			ctx.beginPath();
			ctx.arc(this.canvasX, this.canvasY, 5, 0, Math.PI * 2);  // Draw a circle with a radius of 5 at the center
			ctx.fill();
			ctx.restore();
		}

		// Used for development
		// ctx.save();
		// ctx.font = '12px Arial';
		// ctx.fillStyle = 'black';
		// ctx.textAlign = 'center';
		// ctx.textBaseline = 'middle';
		// ctx.fillText(`(${this.x}, ${this.y})`, this.canvasX, this.canvasY);
		// ctx.restore();
	}

	getImage() {
		if (thePlayer.getGame().selectedTile == this) return hexagonSelected;
		if (this.isHovered) return hexagonHover;
		return hexagon;
	}
}
