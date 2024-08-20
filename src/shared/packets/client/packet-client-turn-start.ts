import { ClientPacketID } from '../base/packet';
import ClientPacket from '../base/client-packet';
import { TurnType, TurnTypeData } from '../../enums/gamestate-enums';
import { TurnInfo } from '../../interfaces/snapshot';

export default class PacketClientTurnStart extends ClientPacket {
	turnInfo: TurnInfo;

	constructor(turnInfo: TurnInfo) {
		super(ClientPacketID.TURN_START.id);
		this.turnInfo = turnInfo;
	}
}
