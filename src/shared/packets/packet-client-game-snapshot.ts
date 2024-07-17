import Packet, { PacketType, ClientPacket } from './packet';
import GameSnapshot from '../interfaces/snapshot';

export default class PacketClientGameSnapshot extends Packet {
	public snapshot;

	constructor(snapshot: GameSnapshot) {
		super(ClientPacket.GAME_SNAPSHOT.id, PacketType.CLIENT_BOUND);

		this.snapshot = snapshot;
	}
};
