import Packet from './packet';
import { Socket } from 'socket.io';
import Enum from '../../enums/enum';

export default class ServerPacket extends Packet {
	constructor(packetTypeIndex: number) {
		super(packetTypeIndex, Enum.PacketDestination.SERVER_BOUND.getIndex());
	}

	sendToServer(clientSocket: Socket) {
		clientSocket.emit('packet', this);
	}
}
