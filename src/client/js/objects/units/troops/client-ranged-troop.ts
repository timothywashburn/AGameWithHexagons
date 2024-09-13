import ClientTroop from '../../client-troop';
import { TroopSnapshot } from '../../../../../shared/interfaces/snapshot';
import { ClientUnitState } from '../../../../../shared/enums/game/client-unit-state';

export default class ClientRangedTroop extends ClientTroop {
	constructor(troopSnapshot: TroopSnapshot) {
		super(troopSnapshot);
	}

	getImageName(): string {
		return 'warn';
	}
}
