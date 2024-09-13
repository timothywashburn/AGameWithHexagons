import ReplyableServerPacket from '../base/replyable-server-packet';
import Enum from '../../enums/enum';

export default class PacketServerDev extends ReplyableServerPacket<object> {
	public data: any;

	constructor(data: any) {
		super(Enum.ServerPacketType.DEV.getIndex());

		this.data = data;
	}
}
