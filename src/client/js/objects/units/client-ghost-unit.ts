import thePlayer from '../client-the-player';
import { ClientUnitState } from '../../../../shared/enums/game/client-unit-state';
import ClientTile from '../client-tile';
import { TroopType } from '../../../../shared/enums/game/troop-type';
import { BuildingType } from '../../../../shared/enums/game/building-type';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default class ClientGhostUnit {
	public type: 'create' | 'destroy';
	public unitType: TroopType | BuildingType;
	public tile: ClientTile;
	public state: ClientUnitState;

	public sprite = new Image();

	constructor(
		type: 'create' | 'destroy',
		unitType: TroopType | BuildingType,
		tileID: number,
		state: ClientUnitState
	) {
		this.type = type;
		this.unitType = unitType;
		this.tile = thePlayer.getGame().getTile(tileID)!;
		this.state = state;

		this.prepareSprite();
	}

	render() {
		ctx.save();

		let timeSinceCreation = (Date.now() - thePlayer.getGame().startTime) / 1000;
		let period = 2.5;
		let phase = (timeSinceCreation % period) / period;

		let pulseFactor = this.getPulseRadius(phase);
		let minRadius = 0;
		let maxRadius = radius * 2;

		ctx.globalAlpha = this.getOpacityRadius(phase);

		let gradient = ctx.createRadialGradient(
			this.tile.canvasX!,
			this.tile.canvasY!,
			0,
			this.tile.canvasX!,
			this.tile.canvasY!,
			minRadius + (maxRadius - minRadius) * pulseFactor
		);
		gradient.addColorStop(0, 'rgba(0, 255, 0, 0.4)');
		gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');

		ctx.fillStyle = gradient;
		ctx.fillRect(this.tile.canvasX! - radius * 2, this.tile.canvasY! - radius * 2, radius * 4, radius * 4);

		ctx.globalAlpha = 1;
		ctx.drawImage(this.sprite, this.tile.canvasX! - radius, this.tile.canvasY! - radius, radius * 2, radius * 2);

		ctx.restore();
	}

	private getPulseRadius(phase: number): number {
		if (phase < 0.5) {
			return Math.sin(Math.PI * phase);
		} else {
			return 1;
		}
	}

	private getOpacityRadius(phase: number): number {
		if (phase < 0.6) {
			return 1;
		} else {
			return Math.sqrt(1 - (phase - 0.6) / 0.4);
		}
	}

	async prepareSprite() {
		try {
			const response = await fetch(`images/${this.unitType.spriteName}.svg`);
			let svgString = await response.text();
			svgString = svgString.replace(/fill:#003545/g, `fill:${thePlayer.getPlayer().teamColor.colorString}`);

			this.sprite = new Image();
			const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
			this.sprite.src = URL.createObjectURL(svgBlob);
		} catch (error) {
			console.error(error);
		}
	}
}
