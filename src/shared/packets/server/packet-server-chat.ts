import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';

export default class PacketServerChat extends ServerPacket {
	public message: string;

	constructor(message: string) {
		super(ServerPacketID.CHAT.id);

		this.message = message;
	}
}
