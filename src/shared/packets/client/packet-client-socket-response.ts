import ClientPacket from '../base/client-packet';
import Enum from '../../enums/enum';

export type ClientInitData = {
	clientID: number;
	guestToken: string | null;
};

export default class PacketClientSocketResponse extends ClientPacket {
	public initData: ClientInitData;

	constructor(initData: ClientInitData) {
		super(Enum.ClientPacketType.SOCKET_RESPONSE.getIndex());
		this.initData = initData;
	}
}
