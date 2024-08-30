import ServerClient from './server-client';
import { TroopSnapshot } from '../../shared/interfaces/snapshot';
import ServerGame from './server-game';
import Enum from '../../shared/enums/enum';
import { TroopType } from '../../shared/enums/game/troop-type';

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
			typeIndex: this.type.getIndex(),
			ownerID: this.owner.getID()
		};
	}
}

export interface ServerTroopInitData {
	game: ServerGame;
	owner: ServerClient;
}
