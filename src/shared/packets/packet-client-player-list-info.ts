import Packet, { PacketType, ClientPacket } from './packet';
import {UserProfile} from '../../server/objects/server-client';

export default class PacketClientPlayerListInfo extends Packet {
	public playerListInfo;

	constructor(playerListInfo: UserProfile[]) {
		super(ClientPacket.PLAYER_LIST_INFO.id, PacketType.CLIENT_BOUND);

		this.playerListInfo = playerListInfo;
	}
};
