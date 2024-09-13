import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';
import Enum from '../../enums/enum';

export interface PacketServerEndTurnReply {
	success: boolean;
}

export default class PacketServerJoinGame extends ReplyableServerPacket<PacketServerEndTurnReply> {
	constructor() {
		super(Enum.ServerPacketType.JOIN_GAME.getIndex());
	}
}
