import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';

export default class PacketServerDev extends ReplyableServerPacket<object> {
	public data: any;

	constructor(data: any) {
		super(ServerPacketID.DEV.id);

		this.data = data;
	}
}
