import Packet, { PacketType, ClientPacket } from './packet';

export default class PacketClientGameInit extends Packet {
	public initData;

	constructor(initData) {
		super(ClientPacket.GAME_INIT.id, PacketType.CLIENT_BOUND);
		this.initData = initData;
	}
};
