import { BuildingSnapshot } from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientElement from './client-element';
import ClientTile from './client-tile';
import { BuildingType } from '../../../shared/enums/game/building-type';
import thePlayer from './client-the-player';
import { ClientUnitState } from '../../../shared/enums/game/client-unit-state';
import ClientUnit from './client-unit';
import Enum from '../../../shared/enums/enum';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default abstract class ClientBuilding extends ClientUnit {
	public type: BuildingType;
	public owner: ClientPlayer;

	public sprite = new Image();

	constructor(buildingSnapshot: BuildingSnapshot) {
		super(buildingSnapshot.id);
		this.type = Enum.BuildingType.getFromIndex(buildingSnapshot.typeIndex);

		this.updateBuilding(buildingSnapshot);

		this.prepareSprite();
	}

	updateBuilding(buildingSnapshot: BuildingSnapshot) {
		this.owner = ClientPlayer.getClient(buildingSnapshot.ownerID)!;
	}

	render() {
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

	destroy() {
		thePlayer.getGame().buildings = thePlayer.getGame().buildings.filter((troop) => troop != this);
	}

	ghostRender(tileID: number) {}

	getParentTile(): ClientTile {
		return thePlayer.getGame().tiles.find((tile) => tile.building === this)!;
	}

	async prepareSprite() {
		try {
			const response = await fetch(`images/${this.type.spriteName}.svg`);
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
