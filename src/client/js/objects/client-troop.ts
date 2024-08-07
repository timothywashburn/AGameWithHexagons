import { getGame } from './client-game';
import ClientTile from './client-tile';
import { TroopSnapshot } from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientElement from './client-element';
import { TroopType } from '../../../shared/enums/unit-enums';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default abstract class ClientTroop extends ClientElement {
	public type: TroopType;
	public owner: ClientPlayer;

	public sprite = new Image();

	protected constructor(troopSnapshot: TroopSnapshot) {
		super(troopSnapshot.id);
		this.type = troopSnapshot.type;

		this.updateTroop(troopSnapshot);

		this.prepareSprite();

		getGame().troops.push(this);
	}

	abstract getImageName(): string;

	updateTroop(troopSnapshot: TroopSnapshot) {
		this.owner = ClientPlayer.getClient(troopSnapshot.ownerID)!;
	}

	renderTroop() {
		ctx.save();
		ctx.drawImage(
			this.sprite,
			this.getParentTile().canvasX! - radius,
			this.getParentTile().canvasY! - radius,
			radius * 2,
			radius * 2,
		);
		ctx.restore();
	}

	getParentTile(): ClientTile {
		return getGame().tiles.find((tile) => tile.troop === this)!;
	}

	async prepareSprite() {
		try {
			const response = await fetch(`images/${this.getImageName()}.svg`);
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
