import ServerClient from './server-client';
import { TroopSnapshot } from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';
import Enum from '../../shared/enums/enum';
import { TroopType } from '../../shared/enums/game/troop-type';
import ClientTroop from '../../client/js/objects/client-troop';
import { Pair } from '../../shared/interfaces/pair';
import { calculateMoves, getAdjacentTiles } from '../../shared/game/util';
import ServerTile from './server-tile';
import ClientTile from '../../client/js/objects/client-tile';
import thePlayer from '../../client/js/objects/client-the-player';
import ServerUnit from './server-unit';
import internal from 'node:stream';

export default abstract class ServerTroop extends ServerUnit {
	public type: TroopType;
	public hasMoved: boolean = false;

	//TODO: Temporary attribute for movement testing. Move to official
	// attribute system once it is created
	public speed: number;

	protected constructor(type: TroopType, initData: ServerTroopInitData) {
		super(initData.game, initData.owner);
		this.type = type;

		this.speed = 2;

		this.game.troops.push(this);
	}

	getTroopSnapshot(): TroopSnapshot {
		return {
			id: this.id,
			typeIndex: this.type.getIndex(),
			ownerID: this.owner.getID()
		};
	}

	getParentTile(): ServerTile {
		return this.game.tiles.find((tile) => tile.troop === this)!;
	}

	verifyMove(originalTile: ServerTile, proposedTile: ServerTile, game: ServerGame): boolean {
		let possibleMoves: Pair<number>[] = getAdjacentTiles(originalTile.x, originalTile.y);

		possibleMoves = possibleMoves.filter((pair) => {
			let tile = game.getTileByPosition(pair.first, pair.second);
			if (tile === null) return false;

			return tile.troop == null && tile.building == null;
		});

		let isOccupied = function (pair: Pair<number>) {
			let tile = game.getTileByPosition(pair.first, pair.second);
			if (tile === null) return false;

			return tile.troop != null || tile.building != null;
		};

		for (let i = 0; i < this.speed - 1; i++) {
			possibleMoves = calculateMoves(possibleMoves, isOccupied);
		}

		for (let possibleMove of possibleMoves) {
			let serverTile = game.getTileByPosition(possibleMove.first, possibleMove.second);
			if (serverTile === null) continue;

			if (proposedTile === serverTile) return true;
		}

		return false;
	}

	destroy() {
		this.game.troops = this.game.troops.filter((troop) => troop !== this);
		for (let tile of this.game.tiles) {
			if (tile.troop != this) continue;
			tile.troop = null;
			return;
		}
	}
}

export interface ServerTroopInitData {
	game: ServerGame;
	owner: ServerClient;
}
