import Packet, { PacketType, ClientPacketType } from '../base/packet';
import GameInitData from '../../interfaces/init-data';
import ClientPacket from '../base/client-packet';

export default class PacketClientGameInit extends ClientPacket {
	public initData;

	constructor(initData: GameInitData) {
		super(ClientPacketType.GAME_INIT.id);
		this.initData = initData;
	}
};
