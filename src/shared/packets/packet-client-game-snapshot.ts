import Packet, { PacketType, ClientPacket } from './packet';

export default class PacketClientGameSnapshot extends Packet {
	public snapshot;

	constructor(snapshot) {
		super(ClientPacket.GAME_SNAPSHOT.id, PacketType.CLIENT_BOUND);

		this.snapshot = snapshot;
	}
};
