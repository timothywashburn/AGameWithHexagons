import ReplyableServerPacket from '../base/replyable-server-packet';
import PlannedAction from '../../game/planned-action';
import Enum from '../../enums/enum';

export interface PacketServerEndTurnReply {
	success: boolean;
}

export default class PacketServerEndTurn extends ReplyableServerPacket<PacketServerEndTurnReply> {
	public plannedActions: PlannedAction<any>[];

	constructor(plannedActions: PlannedAction<any>[]) {
		super(Enum.ServerPacketType.END_TURN.getIndex());

		this.plannedActions = plannedActions;
	}
}
