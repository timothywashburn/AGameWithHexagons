import Packet, { PacketType, ClientPacket } from './packet';

export default class PacketClientPlayerListInfo extends Packet {
	public playerListInfo;

	constructor(playerListInfo) {
		super(ClientPacket.PLAYER_LIST_INFO.id, PacketType.CLIENT_BOUND);

		this.playerListInfo = playerListInfo;
	}
};
