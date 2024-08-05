import {TroopType} from '../shared/enums/unit-enums';
import ClientMeleeTroop from './js/objects/units/client-melee-troop';
import ClientRangedTroop from './js/objects/units/client-ranged-troop';
import {TroopSnapshot} from '../shared/interfaces/snapshot';
import ClientTroop from './js/objects/client-troop';

const clientTroopConstructorMap: {
    [key in TroopType]: ClientTroopConstructor
} = {
    [TroopType.MELEE]: ClientMeleeTroop,
    [TroopType.RANGED]: ClientRangedTroop,
}

type ClientTroopConstructor = new (troopSnapshot: TroopSnapshot) => ClientTroop;

export const getClientTroopConstructor = (type: TroopType): ClientTroopConstructor => {
    return clientTroopConstructorMap[type];
};