import { ClientPacketID } from '../base/packet';
import { GameInitData } from '../../interfaces/snapshot';
import ClientPacket from '../base/client-packet';

export default class PacketClientGameInit extends ClientPacket {
	public initData: GameInitData;

	constructor(initData: GameInitData) {
		super(ClientPacketID.GAME_INIT.id);
		this.initData = initData;
	}
}
