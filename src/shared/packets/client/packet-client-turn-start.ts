import { ClientPacketID } from '../base/packet';
import ClientPacket from '../base/client-packet';
import { TurnType } from '../../enums/gamestate-enums';

export default class PacketClientTurnStart extends ClientPacket {
	type: TurnType;

	constructor(type: TurnType) {
		super(ClientPacketID.TURN_START.id);
		this.type = type;
	}
}
