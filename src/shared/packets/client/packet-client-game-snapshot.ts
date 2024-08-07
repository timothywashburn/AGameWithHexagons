import { ClientPacketID } from '../base/packet';
import { GameSnapshot } from '../../interfaces/snapshot';
import ClientPacket from '../base/client-packet';

export default class PacketClientGameSnapshot extends ClientPacket {
	public snapshot: GameSnapshot;

	constructor(snapshot: GameSnapshot) {
		super(ClientPacketID.GAME_SNAPSHOT.id);

		this.snapshot = snapshot;
	}
}
