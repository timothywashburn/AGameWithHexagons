import ClientTroop from '../client-troop';
import {TroopSnapshot} from '../../../../shared/interfaces/snapshot';
import {getTroopType, TroopType} from '../../../../shared/enums/unit-enums';
import {getGame} from '../client-game';

export default class ClientMeleeTroop extends ClientTroop {

    constructor(troopSnapshot: TroopSnapshot) {
        super(TroopType.MELEE, troopSnapshot);
    }

    getImageName(): string {
        return 'test';
    }
}