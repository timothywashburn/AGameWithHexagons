import ClientPacket from '../base/client-packet';
import Enum from '../../enums/enum';

export default class PacketClientChat extends ClientPacket {
	clientID: number;
	message: string;

	constructor(clientID: number, message: string) {
		super(Enum.ClientPacketType.CHAT.getIndex());

		this.clientID = clientID;
		this.message = message;
	}
}
