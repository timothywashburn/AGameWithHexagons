import ClientTile from './client-tile';
import { TroopSnapshot } from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientElement from './client-element';
import Enum from '../../../shared/enums/enum';
import { TurnType as TroopType } from '../../../shared/enums/game/turn-type';
import thePlayer from './client-the-player';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let radius = 20;

export default abstract class ClientTroop extends ClientElement {
	public type: TroopType;
	public owner: ClientPlayer;
	public hasMoved: boolean = false;

	//TODO: Temporary attribute for movement testing. Move to official
	// attribute system once it is created
	public speed: number

	public sprite = new Image();

	protected constructor(troopSnapshot: TroopSnapshot) {
		super(troopSnapshot.id);
		this.type = Enum.TroopType.getFromIndex(troopSnapshot.typeIndex);

		this.updateTroop(troopSnapshot);

		this.prepareSprite();

		this.speed = 2;

		thePlayer.getGame().troops.push(this);
	}

	abstract getImageName(): string;

	updateTroop(troopSnapshot: TroopSnapshot) {
		this.owner = ClientPlayer.getClient(troopSnapshot.ownerID)!;
		this.hasMoved = false;
	}

	renderTroop() {
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
