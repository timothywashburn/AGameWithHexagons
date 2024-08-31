import { BuildingSnapshot } from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientElement from './client-element';
import ClientTile from './client-tile';
import { BuildingType } from '../../../shared/enums/game/building-type';
import thePlayer from './client-the-player';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default abstract class ClientBuilding extends ClientElement {
	public type: BuildingType;
	public owner: ClientPlayer;

	public sprite = new Image();

	constructor(type: BuildingType, buildingSnapshot: BuildingSnapshot) {
		super(buildingSnapshot.id);
		this.type = type;

		this.updateBuilding(buildingSnapshot);

		this.prepareSprite();

		thePlayer.getGame().buildings.push(this);
	}

	abstract getImageName(): string;

	updateBuilding(buildingSnapshot: BuildingSnapshot) {
		this.owner = ClientPlayer.getClient(buildingSnapshot.ownerID)!;
	}

	renderBuilding() {
		ctx.save();
		ctx.drawImage(
			this.sprite,
			this.getParentTile().canvasX! - radius,
			this.getParentTile().canvasY! - radius,
			radius * 2,
			radius * 2
		);
		ctx.restore();
	}

	getParentTile(): ClientTile {
		return thePlayer.getGame().tiles.find((tile) => tile.building === this)!;
	}

	async prepareSprite() {
		try {
			const response = await fetch(`images/${this.getImageName()}.svg`);
			let svgString = await response.text();
			svgString = svgString.replace(/fill:#003545/g, `fill:${this.owner.teamColor.colorString}`);

			this.sprite = new Image();
			const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
			this.sprite.src = URL.createObjectURL(svgBlob);
		} catch (error) {
			console.error(error);
		}
	}
}
