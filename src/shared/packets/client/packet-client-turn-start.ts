import ClientPacket from '../base/client-packet';
import { GameSnapshot } from '../../interfaces/snapshot';
import Enum from '../../enums/enum';

export default class PacketClientTurnStart extends ClientPacket {
	public snapshot: GameSnapshot;
	public turnNumber: number;
	public turnTypeIndex: number;

	constructor(snapshot: GameSnapshot, turnNumber: number, turnTypeIndex: number) {
		super(Enum.ClientPacketType.TURN_START.getIndex());
		this.snapshot = snapshot;
		this.turnNumber = turnNumber;
		this.turnTypeIndex = turnTypeIndex;
	}
}
