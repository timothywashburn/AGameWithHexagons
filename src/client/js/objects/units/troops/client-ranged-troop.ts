import ClientTroop from '../../client-troop';
import { TroopSnapshot } from '../../../../../shared/interfaces/snapshot';
import { getTroopType, TroopType } from '../../../../../shared/enums/unit-enums';
import { getGame } from '../../client-game';

export default class ClientRangedTroop extends ClientTroop {
	constructor(troopSnapshot: TroopSnapshot) {
		super(TroopType.RANGED, troopSnapshot);
	}

	getImageName(): string {
		return 'test';
	}
}
