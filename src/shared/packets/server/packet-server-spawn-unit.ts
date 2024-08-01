import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';

export default class PacketServerSpawnUnit extends ServerPacket {
    public tileID: number;
    public troopTypeID: number;

    constructor(tileID: number, troopTypeID: number) {
        super(ServerPacketID.SPAWN.id);

        this.tileID = tileID;
        this.troopTypeID = troopTypeID;
    }
};
