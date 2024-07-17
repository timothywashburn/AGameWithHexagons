import Packet, { PacketType, ClientPacket } from './packet';
import GameInitData from '../interfaces/init-data';

export default class PacketClientGameInit extends Packet {
	public initData;

	constructor(initData: GameInitData) {
		super(ClientPacket.GAME_INIT.id, PacketType.CLIENT_BOUND);
		this.initData = initData;
	}
};
