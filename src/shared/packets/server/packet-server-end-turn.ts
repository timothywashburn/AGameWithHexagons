import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';

export interface PacketServerEndTurnReply {
	success: boolean;
}

export default class PacketServerEndTurn extends ReplyableServerPacket<PacketServerEndTurnReply> {
	constructor() {
		super(ServerPacketID.END_TURN.id);
	}
}
