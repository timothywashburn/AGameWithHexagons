import Packet, { PacketType, ClientPacketType } from '../base/packet';
import {UserProfile} from '../../../server/objects/server-client';
import ClientPacket from '../base/client-packet';

export default class PacketClientPlayerListInfo extends ClientPacket {
	public playerListInfo;

	constructor(playerListInfo: UserProfile[]) {
		super(ClientPacketType.PLAYER_LIST_INFO.id);

		this.playerListInfo = playerListInfo;
	}
};
