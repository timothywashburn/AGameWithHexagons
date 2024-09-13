import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';
import Enum from '../../enums/enum';

export interface PacketServerEndTurnReply {
	success: boolean;
}

export default class PacketServerLeaveGame extends ReplyableServerPacket<PacketServerEndTurnReply> {
	constructor() {
		super(Enum.ServerPacketType.LEAVE_GAME.getIndex());
	}
}
