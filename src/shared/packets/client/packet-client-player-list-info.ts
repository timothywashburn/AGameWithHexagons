import { PlayerListItemInfo, UserProfile } from '../../../server/objects/server-client';
import ClientPacket from '../base/client-packet';
import Enum from '../../enums/enum';

export default class PacketClientPlayerListInfo extends ClientPacket {
	public playerListInfo: PlayerListItemInfo[];

	constructor(playerListInfo: PlayerListItemInfo[]) {
		super(Enum.ClientPacketType.PLAYER_LIST_INFO.getIndex());

		this.playerListInfo = playerListInfo;
	}
}
