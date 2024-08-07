import ServerTroop, { ServerTroopInitData } from '../../server-troop';
import { TroopType } from '../../../../shared/enums/unit-enums';

export default class ServerRangedTroopTroop extends ServerTroop {
	constructor(initData: ServerTroopInitData) {
		super(TroopType.MELEE, initData);
	}
}
