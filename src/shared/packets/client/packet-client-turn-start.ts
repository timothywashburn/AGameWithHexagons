import { ClientPacketID } from '../base/packet';
import ClientPacket from '../base/client-packet';
import { GameSnapshot } from '../../interfaces/snapshot';

export default class PacketClientTurnStart extends ClientPacket {
	public snapshot: GameSnapshot;
	public turnNumber: number;
	public turnTypeIndex: number;

	constructor(snapshot: GameSnapshot, turnNumber: number, turnTypeIndex: number) {
		super(ClientPacketID.TURN_START.id);
		this.snapshot = snapshot;
		this.turnNumber = turnNumber;
		this.turnTypeIndex = turnTypeIndex;
	}
}
