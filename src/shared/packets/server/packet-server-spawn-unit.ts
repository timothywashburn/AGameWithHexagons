import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';

export default class PacketServerSpawnUnit extends ServerPacket {
    public troopTypeID: number;
    public tileID: number;

    constructor(troopTypeID: number, tileID: number) {
        super(ServerPacketID.SPAWN.id);

        this.troopTypeID = troopTypeID;
        this.tileID = tileID;
    }
};
