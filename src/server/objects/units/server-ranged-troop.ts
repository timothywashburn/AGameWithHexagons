import ServerTroop, {ServerTroopInitData} from '../server-troop';
import {TroopType} from '../../../shared/enums/unit-enums';
import ServerGame from '../server-game';
import ServerClient from '../server-client';
import ServerTile from '../server-tile';

export default class ServerRangedTroopTroop extends ServerTroop {
    constructor(initData: ServerTroopInitData) {
        super(TroopType.MELEE, initData);
    }
}