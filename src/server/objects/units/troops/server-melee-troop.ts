import ServerTroop, { ServerTroopInitData } from '../../server-troop';
import Enum from '../../../../shared/enums/enum';

export default class ServerMeleeTroop extends ServerTroop {
	constructor(initData: ServerTroopInitData) {
		super(Enum.TroopType.MELEE, initData);
	}
}
