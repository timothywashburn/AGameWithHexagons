import { ServerPacketID } from '../base/packet';
import ReplyableServerPacket from '../base/replyable-server-packet';
import { BuildingType, TroopType } from '../../enums/unit-enums';

export interface PacketServerSpawnUnitReply {
	success: boolean;
}

export default class PacketServerSpawnUnit extends ReplyableServerPacket<PacketServerSpawnUnitReply> {
	public category: 'troop' | 'building';
	public type: TroopType | BuildingType;
	public tileID: number;

	constructor(category: 'troop' | 'building', type: TroopType | BuildingType, tileID: number) {
		super(ServerPacketID.SPAWN.id);

		this.category = category;
		this.type = type;
		this.tileID = tileID;
	}
}
