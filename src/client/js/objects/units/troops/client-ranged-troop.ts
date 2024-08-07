import ClientTroop from '../../client-troop';
import { TroopSnapshot } from '../../../../../shared/interfaces/snapshot';
import { TroopType } from '../../../../../shared/enums/unit-enums';

export default class ClientRangedTroop extends ClientTroop {
	constructor(troopSnapshot: TroopSnapshot) {
		super(TroopType.RANGED, troopSnapshot);
	}

	getImageName(): string {
		return 'test';
	}
}
