import ServerClient from './server-client';
import { TroopSnapshot } from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';
import { TroopType } from '../../shared/enums/unit-enums';

export default abstract class ServerTroop {
	public id: number;
	public type: TroopType;
	public game: ServerGame;
	public owner: ServerClient;

	protected constructor(type: TroopType, initData: ServerTroopInitData) {
		this.type = type;
		this.game = initData.game;
		this.owner = initData.owner;
		this.id = this.game.getNextID();

		this.game.troops.push(this);
	}

	getTroopSnapshot(client: ServerClient): TroopSnapshot {
		return {
			id: this.id,
			type: this.type,
			ownerID: this.owner.getID(),
		};
	}
}

export interface ServerTroopInitData {
	game: ServerGame;
	owner: ServerClient;
}
