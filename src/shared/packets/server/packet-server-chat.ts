import ServerPacket from '../base/server-packet';
import Enum from '../../enums/enum';

export default class PacketServerChat extends ServerPacket {
	public message: string;

	constructor(message: string) {
		super(Enum.ServerPacketType.CHAT.getIndex());

		this.message = message;
	}
}
