import { TroopType } from '../shared/enums/unit-enums';
import ServerMeleeTroop from './objects/units/server-melee-troop';
import ServerRangedTroop from './objects/units/server-ranged-troop';
import ServerTroop, {ServerTroopInitData} from './objects/server-troop';

const serverTroopConstructorMap: {
	[key in TroopType]: ServerTroopConstructor
	} = {
	[TroopType.MELEE]: ServerMeleeTroop,
	[TroopType.RANGED]: ServerRangedTroop
}

type ServerTroopConstructor = new (initData: ServerTroopInitData) => ServerTroop;

export const getServerTroopConstructor = (type: TroopType): ServerTroopConstructor => {
	console.log("type")
	console.log(type);
	console.log(serverTroopConstructorMap)
	console.log(serverTroopConstructorMap[type])
	return serverTroopConstructorMap[type];
};