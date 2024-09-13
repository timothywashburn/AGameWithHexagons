import { UserProfile } from '../../../server/objects/server-client';
import ClientPacket from '../base/client-packet';
import Enum from '../../enums/enum';

export default class PacketClientPlayerListInfo extends ClientPacket {
	public playerListInfo;

	constructor(playerListInfo: UserProfile[]) {
		super(Enum.ClientPacketType.PLAYER_LIST_INFO.getIndex());

		this.playerListInfo = playerListInfo;
	}
}
