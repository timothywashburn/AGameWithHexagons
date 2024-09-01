import { ClientPacketID } from '../base/packet';
import { PlayerListItemInfo, UserProfile } from '../../../server/objects/server-client';
import ClientPacket from '../base/client-packet';

export default class PacketClientPlayerListInfo extends ClientPacket {
	public playerListInfo: PlayerListItemInfo[];

	constructor(playerListInfo: PlayerListItemInfo[]) {
		super(ClientPacketID.PLAYER_LIST_INFO.id);

		this.playerListInfo = playerListInfo;
	}
}
