import Packet, { PacketType, ClientPacketType } from '../base/packet';
import GameSnapshot from '../../interfaces/snapshot';
import ClientPacket from '../base/client-packet';

export default class PacketClientGameSnapshot extends ClientPacket {
	public snapshot;

	constructor(snapshot: GameSnapshot) {
		super(ClientPacketType.GAME_SNAPSHOT.id);

		this.snapshot = snapshot;
	}
};
