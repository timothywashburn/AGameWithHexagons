import ClientTile from './client-tile';
import { TroopSnapshot } from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import Enum from '../../../shared/enums/enum';
import thePlayer from './client-the-player';
import ClientUnit from './client-unit';
import { TroopType } from '../../../shared/enums/game/troop-type';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default abstract class ClientTroop extends ClientUnit {
	public type: TroopType;
	public owner: ClientPlayer;
	public hasMoved: boolean = false;

	//TODO: Temporary attribute for movement testing. Move to official
	// attribute system once it is created
	public speed: number;

	public sprite = new Image();

	protected constructor(troopSnapshot: TroopSnapshot) {
		super(troopSnapshot.id);
		this.type = Enum.TroopType.getFromIndex(troopSnapshot.typeIndex);

		this.updateTroop(troopSnapshot);

		this.prepareSprite();

		this.speed = 2;
	}

	updateTroop(troopSnapshot: TroopSnapshot) {
		this.owner = ClientPlayer.getClient(troopSnapshot.ownerID)!;
		this.hasMoved = false;
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

	getParentTile(): ClientTile {
		return thePlayer.getGame().tiles.find((tile) => tile.troop === this)!;
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
