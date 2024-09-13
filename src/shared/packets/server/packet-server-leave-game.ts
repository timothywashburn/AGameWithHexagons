import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';

export interface PacketServerEndTurnReply {
	success: boolean;
}

export default class PacketServerLeaveGame extends ReplyableServerPacket<PacketServerEndTurnReply> {
	public data: any;

	constructor(data: any) {
		super(ServerPacketID.DEV.id);

		this.data = data;
	}
}