import ReplyableClientPacket from '../base/replyable-client-packet';
import Enum from '../../enums/enum';

export default class PacketClientDev extends ReplyableClientPacket<object> {
	data: any;

	constructor(data: any) {
		super(Enum.ClientPacketType.DEV.getIndex());

		this.data = data;
	}
}
