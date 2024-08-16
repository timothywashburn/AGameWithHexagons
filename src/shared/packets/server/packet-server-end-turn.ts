import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';

export default class PacketServerEndTurn extends ReplyableServerPacket<void> {
	constructor() {
		super(ServerPacketID.END_TURN.id);
	}
}
