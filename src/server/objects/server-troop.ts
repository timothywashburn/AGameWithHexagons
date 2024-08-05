import ServerTile from './server-tile';
import ServerClient from './server-client';
import {TroopSnapshot} from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';
import {TroopType} from '../../shared/enums/unit-enums';
import ServerMeleeTroop from './units/server-melee-troop';
import ServerRangedTroop from './units/server-ranged-troop';

let nextID = 0;

export default abstract class ServerTroop {
	public id: number;
	public type: TroopType;
	public game: ServerGame;
	public owner: ServerClient;
	public parentTile: ServerTile;

	protected constructor(type: TroopType, initData: ServerTroopInitData) {
		this.id = nextID++;
		this.type = type;
		this.game = initData.game;
		this.owner = initData.owner;
		this.parentTile = initData.parentTile;

		this.game.troops.push(this);
	}

	getTroopSnapshot(client: ServerClient): TroopSnapshot {
		return {
			id: this.id,
			typeID: this.type,
			ownerID: this.owner.getID(),
			parentTileID: this.parentTile.id
		}
	}
}

export interface ServerTroopInitData {
	game: ServerGame,
	owner: ServerClient,
	parentTile: ServerTile
}