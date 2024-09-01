import { ServerPacketID } from '../base/packet';
import ReplyableServerPacket from '../base/replyable-server-packet';

export interface PacketServerSpawnUnitReply {
	success: boolean;
}

export default class PacketServerSpawnUnit extends ReplyableServerPacket<PacketServerSpawnUnitReply> {
	public category: 'troop' | 'building';
	public unitIndex: number;
	public tileID: number;

	constructor(category: 'troop' | 'building', unitIndex: number, tileID: number) {
		super(ServerPacketID.SPAWN.id);

		this.category = category;
		this.unitIndex = unitIndex;
		this.tileID = tileID;
	}
}
