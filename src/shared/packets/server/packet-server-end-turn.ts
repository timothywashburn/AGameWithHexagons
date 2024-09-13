import { ServerPacketID } from '../base/packet';
import ServerPacket from '../base/server-packet';
import ReplyableServerPacket from '../base/replyable-server-packet';
import PlannedAction from '../../game/planned-action';

export interface PacketServerEndTurnReply {
	success: boolean;
}

export default class PacketServerEndTurn extends ReplyableServerPacket<PacketServerEndTurnReply> {
	public plannedActions: PlannedAction<any>[];

	constructor(plannedActions: PlannedAction<any>[]) {
		super(ServerPacketID.END_TURN.id);

		this.plannedActions = plannedActions;
	}
}
