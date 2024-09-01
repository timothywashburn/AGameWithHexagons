import ServerTroop, { ServerTroopInitData } from '../../server-troop';
import Enum from '../../../../shared/enums/enum';

export default class ServerRangedTroopTroop extends ServerTroop {
	constructor(initData: ServerTroopInitData) {
		super(Enum.TroopType.RANGED, initData);
	}
}
