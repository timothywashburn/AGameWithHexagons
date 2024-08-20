import { ClientPacketID } from '../base/packet';
import ClientPacket from '../base/client-packet';
import ReplyableClientPacket from '../base/replyable-client-packet';

export default class PacketClientDev extends ReplyableClientPacket<object> {
	data: any;

	constructor(data: any) {
		super(ClientPacketID.DEV.id);

		this.data = data;
	}
}
