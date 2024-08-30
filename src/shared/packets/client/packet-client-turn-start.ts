import { ClientPacketID } from '../base/packet';
import ClientPacket from '../base/client-packet';

export default class PacketClientTurnStart extends ClientPacket {
	public turnNumber: number;
	public turnTypeIndex: number;

	constructor(turnNumber: number, turnTypeIndex: number) {
		super(ClientPacketID.TURN_START.id);
		this.turnNumber = turnNumber;
		this.turnTypeIndex = turnTypeIndex;
	}
}
