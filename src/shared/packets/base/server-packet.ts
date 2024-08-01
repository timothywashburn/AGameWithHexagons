import Packet, {PacketDestination} from './packet';
import {Socket} from 'socket.io';

export default class ServerPacket extends Packet {

	constructor(packetTypeID: number) {
		super(packetTypeID, PacketDestination.SERVER_BOUND);
	}

	sendToServer(clientSocket: Socket) {
		clientSocket.emit('packet', this);
	}
}