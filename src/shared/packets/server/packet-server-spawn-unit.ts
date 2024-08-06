import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';

export interface PacketServerSpawnUnitReply {
	success: boolean;
}

export default class PacketServerSpawnUnit extends ReplyableServerPacket<PacketServerSpawnUnitReply> {
	public troopTypeID: number;
	public tileID: number;

	constructor(troopTypeID: number, tileID: number) {
		super(ServerPacketID.SPAWN.id);

		this.troopTypeID = troopTypeID;
		this.tileID = tileID;
	}
}
