import { ClientPacketID } from '../base/packet';
import { GameInitData } from '../../interfaces/snapshot';
import ClientPacket from '../base/client-packet';
import PlannedAction from "../../game/planned-action";

export type ClientInitData = {
	clientID: number;
	guestToken: string | null;
};

export default class PacketClientSocketResponse extends ClientPacket {
	public initData: ClientInitData;

	constructor(initData: ClientInitData) {
		super(ClientPacketID.SOCKET_RESPONSE.id);
		this.initData = initData;
	}
}
