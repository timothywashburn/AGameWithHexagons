import { GameInitData } from '../../interfaces/snapshot';
import ClientPacket from '../base/client-packet';
import Enum from '../../enums/enum';

export default class PacketClientGameInit extends ClientPacket {
	public initData: GameInitData;

	constructor(initData: GameInitData) {
		super(Enum.ClientPacketType.GAME_INIT.getIndex());
		this.initData = initData;
	}
}
