import Packet, { PacketDestination, ClientPacketID } from '../base/packet';
import {GameSnapshot} from '../../interfaces/snapshot';
import ClientPacket from '../base/client-packet';

export default class PacketClientGameInit extends ClientPacket {
	public initData: GameSnapshot;

	constructor(initData: GameSnapshot) {
		super(ClientPacketID.GAME_INIT.id);
		this.initData = initData;
	}
};
