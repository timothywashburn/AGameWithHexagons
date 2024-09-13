import thePlayer from '../client-the-player';
import { ClientUnitState } from '../../../../shared/enums/game/client-unit-state';
import ClientTile from '../client-tile';
import { TroopType } from '../../../../shared/enums/game/troop-type';
import { BuildingType } from '../../../../shared/enums/game/building-type';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default class ClientGhostUnit {
	public unitType: TroopType | BuildingType;
	public tile: ClientTile;
	public state: ClientUnitState;

	public sprite = new Image();

	constructor(unitType: TroopType | BuildingType, tileID: number, state: ClientUnitState) {
		this.unitType = unitType;
		this.tile = thePlayer.getGame().getTile(tileID)!;
		this.state = state;

		this.prepareSprite();
	}

	render() {
		ctx.save();

		const timeSinceCreation = (Date.now() - thePlayer.getGame().startTime) / 1000;
		const pulseFactor = (Math.sin((timeSinceCreation * Math.PI) / 2) + 1) / 2;
		const minOpacity = 0.3;
		const maxOpacity = 0.7;
		ctx.globalAlpha = minOpacity + (maxOpacity - minOpacity) * pulseFactor;

		ctx.drawImage(this.sprite, this.tile.canvasX! - radius, this.tile.canvasY! - radius, radius * 2, radius * 2);
		ctx.restore();
	}

	async prepareSprite() {
		try {
			const response = await fetch(`images/${this.unitType.spriteName}.svg`);
			let svgString = await response.text();
			// svgString = svgString.replace(/fill:#003545/g, `fill:${this.owner.teamColor.colorString}`); // TODO: replace after id can be accessed

			this.sprite = new Image();
			const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
			this.sprite.src = URL.createObjectURL(svgBlob);
		} catch (error) {
			console.error(error);
		}
	}
}
